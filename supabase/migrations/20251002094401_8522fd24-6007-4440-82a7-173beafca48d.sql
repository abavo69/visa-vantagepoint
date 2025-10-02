-- Add RLS policies for admins to manage payments
CREATE POLICY "Admins can insert payments for any user"
ON public.visa_payments
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update any payment"
ON public.visa_payments
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete any payment"
ON public.visa_payments
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all payments"
ON public.visa_payments
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));