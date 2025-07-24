-- ============================================
-- ELIMINAR TRIGGER PROBLEMÁTICO
-- ============================================

-- Eliminar el trigger que está causando el error 500
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Eliminar la función asociada
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Verificar que se eliminaron
SELECT 'Trigger eliminado correctamente' as status;

-- ============================================
-- VERIFICAR TABLA PROFILES
-- ============================================

-- Verificar que la tabla profiles existe y tiene la estructura correcta
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Verificar cuántos perfiles existen
SELECT COUNT(*) as total_profiles FROM profiles;

-- Verificar el perfil admin actual
SELECT id, email, name, role, is_active 
FROM profiles 
WHERE role = 'admin' 
LIMIT 5;

-- ============================================
-- MENSAJE DE CONFIRMACIÓN
-- ============================================

SELECT 'Trigger eliminado - ahora puedes intentar crear usuarios manualmente' as final_status; 