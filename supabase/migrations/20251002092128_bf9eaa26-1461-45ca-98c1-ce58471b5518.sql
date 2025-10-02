-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Update client_documents policies to allow admin access
CREATE POLICY "Admins can view all documents"
ON public.client_documents
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can upload documents for any user"
ON public.client_documents
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update any document"
ON public.client_documents
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete any document"
ON public.client_documents
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Update storage policies for admin access
CREATE POLICY "Admins can upload any document"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'client-documents' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can update any document"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'client-documents' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can delete any document"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'client-documents' AND
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Admins can view all documents"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'client-documents' AND
  public.has_role(auth.uid(), 'admin')
);