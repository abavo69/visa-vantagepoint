ALTER TABLE public.chat_messages ADD COLUMN IF NOT EXISTS sender text NOT NULL DEFAULT 'user';

CREATE POLICY "Admins can insert messages for any user"
ON public.chat_messages
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));