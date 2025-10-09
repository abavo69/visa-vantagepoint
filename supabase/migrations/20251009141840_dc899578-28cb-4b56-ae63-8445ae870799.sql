-- Fix login_history security issue: Restrict INSERT to authenticated users inserting their own records
-- Drop the existing insecure policy
DROP POLICY IF EXISTS "System can insert login history" ON public.login_history;

-- Create a secure policy that only allows users to insert their own login records
CREATE POLICY "Users can insert their own login history"
ON public.login_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);