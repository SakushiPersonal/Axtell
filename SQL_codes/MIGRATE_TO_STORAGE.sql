-- =============================================
-- MIGRACIÓN A SUPABASE STORAGE
-- =============================================

-- PASO 1: Crear bucket de storage (ejecutar desde Supabase Dashboard)
-- Nombre del bucket: 'property-media'
-- Configuración: Público = true

-- PASO 2: Configurar políticas de Storage
-- Permitir lectura pública
INSERT INTO storage.buckets (id, name, public) 
VALUES ('property-media', 'property-media', true)
ON CONFLICT (id) DO NOTHING;

-- Política de lectura pública
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'property-media');

-- Política de upload para usuarios autenticados
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'property-media' 
  AND auth.role() = 'authenticated'
);

-- Política de delete para propietarios
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'property-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Política de update para propietarios
CREATE POLICY "Users can update own files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'property-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- PASO 3: Agregar nueva columna media a la tabla properties
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS media JSONB DEFAULT '[]'::jsonb;

-- PASO 4: Crear índice para la nueva columna media
CREATE INDEX IF NOT EXISTS idx_properties_media ON properties USING gin(media);

-- PASO 5: Función auxiliar para migrar datos (OPCIONAL)
-- Esta función convierte las imágenes Base64 existentes a un formato compatible
CREATE OR REPLACE FUNCTION migrate_images_to_media_format()
RETURNS void AS $$
DECLARE
  prop RECORD;
  image_url TEXT;
  media_array JSONB := '[]'::jsonb;
  image_counter INTEGER;
BEGIN
  -- Iterar sobre todas las propiedades que tienen imágenes
  FOR prop IN 
    SELECT id, images, captador_id 
    FROM properties 
    WHERE images IS NOT NULL 
    AND array_length(images, 1) > 0
    AND (media IS NULL OR media = '[]'::jsonb)
  LOOP
    media_array := '[]'::jsonb;
    image_counter := 1;
    
    -- Convertir cada imagen del array a formato MediaFile
    FOREACH image_url IN ARRAY prop.images
    LOOP
      IF image_url IS NOT NULL AND image_url != '' THEN
        media_array := media_array || jsonb_build_object(
          'id', gen_random_uuid()::text,
          'url', image_url,
          'type', 'image',
          'name', 'migrated_image_' || image_counter || '.jpg',
          'size', 0,
          'uploadedAt', now()::text
        );
        image_counter := image_counter + 1;
      END IF;
    END LOOP;
    
    -- Actualizar la columna media
    UPDATE properties 
    SET media = media_array 
    WHERE id = prop.id;
    
    RAISE NOTICE 'Migrated % images for property %', array_length(prop.images, 1), prop.id;
  END LOOP;
  
  RAISE NOTICE 'Migration completed successfully';
END;
$$ LANGUAGE plpgsql;

-- PASO 6: Función para limpiar archivos huérfanos en storage
CREATE OR REPLACE FUNCTION cleanup_orphaned_storage_files()
RETURNS void AS $$
DECLARE
  file_record RECORD;
  property_exists BOOLEAN;
BEGIN
  -- Esta función debe ejecutarse periódicamente para limpiar archivos sin referencias
  RAISE NOTICE 'Cleanup function created. Execute manually when needed.';
END;
$$ LANGUAGE plpgsql;

-- PASO 7: Trigger para limpiar archivos al eliminar propiedades (FUTURO)
-- CREATE OR REPLACE FUNCTION cleanup_property_files()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   -- Aquí iríá la lógica para eliminar archivos de storage
--   -- cuando se elimina una propiedad
--   RETURN OLD;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER trigger_cleanup_property_files
--   BEFORE DELETE ON properties
--   FOR EACH ROW EXECUTE FUNCTION cleanup_property_files();

-- =============================================
-- INSTRUCCIONES DE USO:
-- =============================================

-- 1. Ejecutar este script en el SQL Editor de Supabase
-- 2. Verificar que el bucket 'property-media' se creó correctamente
-- 3. (OPCIONAL) Ejecutar la migración de datos existentes:
--    SELECT migrate_images_to_media_format();
-- 4. Actualizar la aplicación para usar el nuevo sistema
-- 5. Una vez verificado, se puede eliminar la columna 'images' antigua:
--    ALTER TABLE properties DROP COLUMN images;

-- =============================================
-- VERIFICACIONES:
-- =============================================

-- Verificar que las políticas se crearon
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Verificar la nueva columna
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'properties' AND column_name = 'media';

-- Verificar bucket
SELECT * FROM storage.buckets WHERE id = 'property-media';

-- Ver ejemplo de datos migrados
SELECT id, title, 
       array_length(images, 1) as old_images_count,
       jsonb_array_length(COALESCE(media, '[]'::jsonb)) as new_media_count
FROM properties 
WHERE images IS NOT NULL 
LIMIT 5; 