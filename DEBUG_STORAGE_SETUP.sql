-- =============================================
-- DIAGNÓSTICO Y CORRECCIÓN DEL STORAGE
-- =============================================

-- PASO 1: Verificar bucket existente
SELECT id, name, public, created_at 
FROM storage.buckets 
WHERE id = 'property-media';

-- PASO 2: Si el bucket no existe, crearlo
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-media', 'property-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- PASO 3: Eliminar políticas existentes problemáticas
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;

-- PASO 4: Crear políticas correctas y simples

-- Permitir lectura pública a todos los archivos del bucket
CREATE POLICY "Public read access to property-media" ON storage.objects
FOR SELECT 
USING (bucket_id = 'property-media');

-- Permitir subida a usuarios autenticados
CREATE POLICY "Authenticated upload to property-media" ON storage.objects
FOR INSERT 
WITH CHECK (
  bucket_id = 'property-media' 
  AND auth.role() = 'authenticated'
);

-- Permitir actualización a usuarios autenticados
CREATE POLICY "Authenticated update to property-media" ON storage.objects
FOR UPDATE 
USING (
  bucket_id = 'property-media' 
  AND auth.role() = 'authenticated'
);

-- Permitir eliminación a usuarios autenticados
CREATE POLICY "Authenticated delete to property-media" ON storage.objects
FOR DELETE 
USING (
  bucket_id = 'property-media' 
  AND auth.role() = 'authenticated'
);

-- PASO 5: Verificar políticas creadas
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%property-media%';

-- PASO 6: Verificar permisos del usuario actual
SELECT 
  auth.uid() as current_user_id,
  auth.role() as current_role,
  auth.email() as current_email;

-- PASO 7: Prueba de políticas - ejecutar cuando esté autenticado
-- SELECT policy_check('storage', 'objects', 'property-media');

-- =============================================
-- CONFIGURACIÓN ADICIONAL DE LA COLUMNA MEDIA
-- =============================================

-- Agregar nueva columna media si no existe
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]'::jsonb;

-- Crear índice para búsquedas eficientes
CREATE INDEX IF NOT EXISTS idx_properties_media ON properties USING gin(media);

-- =============================================
-- VERIFICACIONES FINALES
-- =============================================

-- Mostrar configuración del bucket
SELECT 'Bucket Configuration:' as info;
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'property-media';

-- Mostrar políticas activas
SELECT 'Storage Policies:' as info;
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage'
AND policyname LIKE '%property-media%';

-- Mostrar estructura de la tabla properties
SELECT 'Properties Table Structure:' as info;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'properties' 
AND column_name IN ('images', 'media')
ORDER BY ordinal_position; 