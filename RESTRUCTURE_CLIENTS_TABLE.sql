-- =====================================================
-- REESTRUCTURACIÓN COMPLETA DE LA TABLA CLIENTS
-- =====================================================
-- Este script modifica la tabla 'clients' para tener una estructura más clara y organizada

BEGIN;

-- 1. AGREGAR NUEVAS COLUMNAS
-- =====================================================

-- Tipo de operación que busca el cliente
ALTER TABLE clients ADD COLUMN IF NOT EXISTS type TEXT CHECK (type IN ('venta', 'arriendo', 'ambas'));

-- Ubicación preferida
ALTER TABLE clients ADD COLUMN IF NOT EXISTS ubication TEXT;

-- Rango de habitaciones
ALTER TABLE clients ADD COLUMN IF NOT EXISTS rooms_min INTEGER CHECK (rooms_min >= 0);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS rooms_max INTEGER CHECK (rooms_max >= 0 AND rooms_max >= rooms_min);

-- Rango de baños
ALTER TABLE clients ADD COLUMN IF NOT EXISTS bathrooms_min INTEGER CHECK (bathrooms_min >= 0);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS bathrooms_max INTEGER CHECK (bathrooms_max >= 0 AND bathrooms_max >= bathrooms_min);

-- Rango de área (en m²)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS area_min INTEGER CHECK (area_min >= 0);
ALTER TABLE clients ADD COLUMN IF NOT EXISTS area_max INTEGER CHECK (area_max >= 0 AND area_max >= area_min);

-- Características extras (ej: piscina, quincho, jardín, etc.)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS characteristics TEXT;

-- 2. MIGRAR DATOS EXISTENTES DONDE SEA POSIBLE
-- =====================================================

-- Migrar datos de 'interests' a las nuevas columnas
UPDATE clients SET 
  type = CASE 
    WHEN interests ILIKE '%venta%' AND interests ILIKE '%arriendo%' THEN 'ambas'
    WHEN interests ILIKE '%venta%' OR interests ILIKE '%sale%' THEN 'venta'
    WHEN interests ILIKE '%arriendo%' OR interests ILIKE '%rent%' THEN 'arriendo'
    ELSE 'ambas' -- Default si no se puede determinar
  END
WHERE type IS NULL;

-- Migrar ubicaciones conocidas
UPDATE clients SET 
  ubication = CASE 
    WHEN interests ILIKE '%las condes%' THEN 'Las Condes'
    WHEN interests ILIKE '%providencia%' THEN 'Providencia'
    WHEN interests ILIKE '%ñuñoa%' THEN 'Ñuñoa'
    WHEN interests ILIKE '%vitacura%' THEN 'Vitacura'
    WHEN interests ILIKE '%santiago centro%' THEN 'Santiago Centro'
    WHEN interests ILIKE '%lo barnechea%' THEN 'Lo Barnechea'
    WHEN interests ILIKE '%la reina%' THEN 'La Reina'
    WHEN interests ILIKE '%san miguel%' THEN 'San Miguel'
    WHEN interests ILIKE '%maipú%' THEN 'Maipú'
    WHEN interests ILIKE '%puente alto%' THEN 'Puente Alto'
    WHEN interests ILIKE '%la florida%' THEN 'La Florida'
    ELSE NULL
  END
WHERE ubication IS NULL;

-- Migrar características desde interests
UPDATE clients SET 
  characteristics = CASE 
    WHEN interests ~ '(piscina|quincho|jardín|jardin|terraza|balcón|balcon|estacionamiento|parking|bodega|seguridad|portería|porteria|gimnasio|gym|vista al mar|amoblado|amueblado)' 
    THEN regexp_replace(
      regexp_replace(
        regexp_replace(interests, '(venta|arriendo|sale|rent|las condes|providencia|ñuñoa|vitacura|santiago centro|lo barnechea|la reina|san miguel|maipú|puente alto|la florida)', '', 'gi'),
        '\s*,\s*,\s*', ', ', 'g'
      ),
      '^\s*,\s*|\s*,\s*$', '', 'g'
    )
    ELSE NULL
  END
WHERE characteristics IS NULL AND interests IS NOT NULL;

-- 3. LIMPIAR DATOS MIGRADOS
-- =====================================================

-- Remover valores vacíos o duplicados en characteristics
UPDATE clients SET 
  characteristics = NULLIF(TRIM(characteristics), '')
WHERE characteristics IS NOT NULL;

-- 4. REMOVER COLUMNAS ANTIGAS (OPCIONAL - DESCOMENTA SI QUIERES ELIMINARLAS)
-- =====================================================
-- ADVERTENCIA: Esto eliminará permanentemente los datos de las columnas antiguas
-- Descomenta las siguientes líneas solo si estás seguro de que la migración es correcta

-- ALTER TABLE clients DROP COLUMN IF EXISTS interests;
-- ALTER TABLE clients DROP COLUMN IF EXISTS preferred_property_types;

-- 5. AGREGAR COMENTARIOS PARA DOCUMENTACIÓN
-- =====================================================

COMMENT ON COLUMN clients.type IS 'Tipo de operación: venta, arriendo, o ambas';
COMMENT ON COLUMN clients.ubication IS 'Ubicación preferida del cliente';
COMMENT ON COLUMN clients.budget_min IS 'Presupuesto mínimo en CLP';
COMMENT ON COLUMN clients.budget_max IS 'Presupuesto máximo en CLP';
COMMENT ON COLUMN clients.rooms_min IS 'Número mínimo de habitaciones';
COMMENT ON COLUMN clients.rooms_max IS 'Número máximo de habitaciones';
COMMENT ON COLUMN clients.bathrooms_min IS 'Número mínimo de baños';
COMMENT ON COLUMN clients.bathrooms_max IS 'Número máximo de baños';
COMMENT ON COLUMN clients.area_min IS 'Área mínima en metros cuadrados';
COMMENT ON COLUMN clients.area_max IS 'Área máxima en metros cuadrados';
COMMENT ON COLUMN clients.characteristics IS 'Características extras: piscina, quincho, jardín, etc.';

-- 6. CREAR ÍNDICES PARA MEJORAR RENDIMIENTO
-- =====================================================

-- Índice para tipo de operación
CREATE INDEX IF NOT EXISTS idx_clients_type ON clients(type);

-- Índice para ubicación
CREATE INDEX IF NOT EXISTS idx_clients_ubication ON clients(ubication);

-- Índice para rango de presupuesto
CREATE INDEX IF NOT EXISTS idx_clients_budget ON clients(budget_min, budget_max);

-- Índice para fecha de creación
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);

-- Índice para vendedor
CREATE INDEX IF NOT EXISTS idx_clients_vendedor_id ON clients(vendedor_id);

-- 7. VERIFICAR LA ESTRUCTURA FINAL
-- =====================================================

-- Mostrar la estructura de la tabla después de los cambios
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'clients' 
AND table_schema = 'public'
ORDER BY ordinal_position;

COMMIT;

-- =====================================================
-- VERIFICACIÓN POST-MIGRACIÓN
-- =====================================================

-- Contar registros con datos migrados
SELECT 
    COUNT(*) as total_clients,
    COUNT(type) as clients_with_type,
    COUNT(ubication) as clients_with_ubication,
    COUNT(characteristics) as clients_with_characteristics,
    COUNT(budget_min) as clients_with_budget_min,
    COUNT(budget_max) as clients_with_budget_max
FROM clients;

-- Mostrar algunos ejemplos de datos migrados
SELECT 
    name,
    type,
    ubication,
    budget_min,
    budget_max,
    characteristics,
    created_at
FROM clients 
WHERE type IS NOT NULL OR ubication IS NOT NULL 
LIMIT 5;

-- =====================================================
-- NOTA IMPORTANTE:
-- =====================================================
-- Después de ejecutar este script exitosamente:
-- 1. Verifica que los datos se migraron correctamente
-- 2. Actualiza las interfaces TypeScript
-- 3. Modifica los convertidores de datos
-- 4. Actualiza los formularios en la interfaz
-- 5. Si todo funciona bien, descomenta las líneas para eliminar las columnas antiguas 