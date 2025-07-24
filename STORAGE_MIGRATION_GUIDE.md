# 🚀 Migración a Supabase Storage - Guía Paso a Paso

## 📋 **Objetivos**
- Migrar de Base64 en BD a Supabase Storage
- Soportar imágenes Y videos para propiedades
- Mejorar rendimiento y escalabilidad
- Implementar CDN automático

## 🛠️ **Paso 1: Configurar Storage en Supabase**

### A) Crear bucket en Supabase Dashboard:
1. Ir a **Storage** en el dashboard de Supabase
2. Crear nuevo bucket: `property-media`
3. Configurar como **público** para acceso directo
4. Establecer políticas de RLS

### B) Políticas de Storage (SQL):
```sql
-- Permitir lectura pública
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT USING (bucket_id = 'property-media');

-- Permitir upload a usuarios autenticados
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'property-media' 
  AND auth.role() = 'authenticated'
);

-- Permitir delete a propietarios/admins
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'property-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

## 🔧 **Paso 2: Actualizar Tipos TypeScript**

### A) Nuevo tipo MediaFile:
```typescript
export interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video';
  name: string;
  size: number;
  uploadedAt: string;
}
```

### B) Actualizar Property interface:
```typescript
export interface Property {
  // ... otros campos
  media: MediaFile[]; // Reemplaza images: string[]
}
```

## 📁 **Paso 3: Servicio de Storage**

Crear `src/services/storageService.ts` con funciones para:
- Subir archivos
- Eliminar archivos  
- Obtener URLs públicas
- Validar tipos y tamaños

## 🎨 **Paso 4: Nuevo Componente MediaUpload**

Reemplazar `ImageUpload` con `MediaUpload` que soporte:
- Imágenes: JPG, PNG, WebP, GIF
- Videos: MP4, WebM, MOV
- Drag & drop
- Vista previa de videos
- Progreso de upload

## 🔄 **Paso 5: Actualizar Componentes**

- `PropertyCard`: Mostrar thumbnail de video
- `PropertyDetail`: Player de video embebido
- `AdminProperties`: Nuevo componente MediaUpload

## 💾 **Paso 6: Migración de Base de Datos**

### A) Nueva columna en properties:
```sql
ALTER TABLE properties 
ADD COLUMN media JSONB DEFAULT '[]'::jsonb;
```

### B) Script de migración (opcional):
Convertir `images` Base64 existentes a Storage URLs

## ✅ **Paso 7: Testing**

- Upload de imágenes
- Upload de videos
- Visualización en web pública
- Gestión desde admin

---

## 📊 **Configuraciones Recomendadas**

### Límites de archivos:
- **Imágenes**: Máx 10MB c/u, hasta 15 por propiedad
- **Videos**: Máx 100MB c/u, hasta 3 por propiedad
- **Formatos soportados**: 
  - Imágenes: .jpg, .jpeg, .png, .webp, .gif
  - Videos: .mp4, .webm, .mov

### Organización en Storage:
```
property-media/
├── [user-id]/
│   └── [property-id]/
│       ├── images/
│       │   ├── img1.jpg
│       │   └── img2.png
│       └── videos/
│           └── video1.mp4
```

¿Listo para empezar? 🚀 