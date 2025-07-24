-- ============================================
-- AGREGAR COLUMNA PHONE SI NO EXISTE
-- ============================================

-- Verificar si la columna phone existe
DO $$
BEGIN
    -- Intentar agregar la columna phone si no existe
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'phone'
    ) THEN
        ALTER TABLE profiles ADD COLUMN phone TEXT;
        RAISE NOTICE 'Columna phone agregada a la tabla profiles';
    ELSE
        RAISE NOTICE 'Columna phone ya existe en la tabla profiles';
    END IF;
END $$;

-- Verificar la estructura actualizada
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Verificar algunos registros
SELECT id, email, name, role, phone, is_active 
FROM profiles 
LIMIT 3; 