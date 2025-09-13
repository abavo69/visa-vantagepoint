-- Add country and age fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN country TEXT,
ADD COLUMN age INTEGER;

-- Update the trigger function to handle new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, first_name, last_name, country, age)
  VALUES (
    gen_random_uuid(),
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'country',
    CASE 
      WHEN NEW.raw_user_meta_data ->> 'age' IS NOT NULL 
      THEN (NEW.raw_user_meta_data ->> 'age')::INTEGER 
      ELSE NULL 
    END
  );
  RETURN NEW;
END;
$$;