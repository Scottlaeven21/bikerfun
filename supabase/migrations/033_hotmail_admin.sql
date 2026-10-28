-- Extra admin: scottlaeven@hotmail.com
-- Het zuyd-account blijft ongewijzigd.

INSERT INTO public.profiles (id, email, full_name, is_admin)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', 'Scott Laeven'),
  true
FROM auth.users u
WHERE lower(u.email) = 'scottlaeven@hotmail.com'
ON CONFLICT (id) DO UPDATE
SET is_admin = true,
    email = EXCLUDED.email;
