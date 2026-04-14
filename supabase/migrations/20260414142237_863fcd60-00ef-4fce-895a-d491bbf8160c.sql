
CREATE POLICY "Admins can view all chat messages"
ON public.chat_messages
FOR SELECT
TO public
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update any chat message"
ON public.chat_messages
FOR UPDATE
TO public
USING (has_role(auth.uid(), 'admin'::app_role));
