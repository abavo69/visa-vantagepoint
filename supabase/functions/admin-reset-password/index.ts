import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader) return json({ error: "Unauthorized" }, 401);

    // Caller-bound client (JWT identity only)
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: userError } = await callerClient.auth.getUser();
    if (userError || !user) return json({ error: "Unauthorized" }, 401);

    // Separate service client for privileged operations
    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) return json({ error: "Forbidden" }, 403);

    const { userId, mode, newPassword, redirectTo } = await req.json();
    if (!userId) return json({ error: "userId is required" }, 400);

    const { data: target, error: targetError } = await admin.auth.admin.getUserById(userId);
    if (targetError || !target?.user) return json({ error: "User not found" }, 404);

    if (mode === "set") {
      if (typeof newPassword !== "string" || newPassword.length < 8) {
        return json({ error: "Password must be at least 8 characters" }, 400);
      }
      const { error } = await admin.auth.admin.updateUserById(userId, { password: newPassword });
      if (error) throw error;
      console.log(`Admin ${user.id} set a new password for user ${userId}`);
      return json({ success: true, mode: "set" });
    }

    // Default: email the user a password reset link
    const email = target.user.email;
    if (!email) return json({ error: "User has no email address" }, 400);

    const { error } = await admin.auth.resetPasswordForEmail(email, {
      redirectTo: redirectTo || undefined,
    });
    if (error) throw error;

    console.log(`Admin ${user.id} sent a reset email to user ${userId}`);
    return json({ success: true, mode: "email", email });
  } catch (e) {
    console.error("admin-reset-password error:", e);
    return json({ error: (e as Error).message }, 500);
  }
});
