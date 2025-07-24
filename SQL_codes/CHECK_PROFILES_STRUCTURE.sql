-- ============================================
-- VERIFICAR ESTRUCTURA DE TABLA PROFILES
-- ============================================

-- Verificar columnas de la tabla profiles
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Verificar algunos registros para ver qué datos se están guardando
SELECT id, email, name, role, phone, is_active 
FROM profiles 
LIMIT 5;

-- Verificar si la columna phone existe específicamente
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'phone'
) as phone_column_exists; 