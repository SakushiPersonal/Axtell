-- QUICK FIX: Solución inmediata para el problema de login
-- Ejecuta estos comandos en el SQL Editor de Supabase

-- 1. Verificar si el usuario admin existe en auth.users
SELECT id, email FROM auth.users WHERE email = 'admin@axtell.com';

-- 2. Si existe, verificar si tiene perfil en profiles
SELECT * FROM profiles WHERE email = 'admin@axtell.com';

-- 3. Si NO tiene perfil, crearlo manualmente (reemplaza 'USER_ID_AQUI' con el ID real del paso 1)
INSERT INTO profiles (id, email, name, role, is_active, created_at, updated_at) 
VALUES (
  'USER_ID_AQUI', -- Reemplaza con el ID del usuario de auth.users
  'admin@axtell.com', 
  'Administrador', 
  'admin', 
  true, 
  NOW(), 
  NOW()
);

-- 4. Crear función y trigger para futuros usuarios (copia completa)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, is_active)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)), 
    CASE 
      WHEN NEW.email = 'admin@axtell.com' THEN 'admin'
      ELSE 'vendedor'
    END,
    true
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Crear trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 6. Verificar que todo está funcionando
SELECT 
  u.id, 
  u.email, 
  p.name, 
  p.role, 
  p.is_active 
FROM auth.users u 
LEFT JOIN profiles p ON u.id = p.id 
WHERE u.email = 'admin@axtell.com'; 