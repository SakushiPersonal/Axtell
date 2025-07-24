# 🚨 **SOLUCIÓN RÁPIDA PARA PROBLEMA DE STORAGE**

## 🔍 **Diagnóstico paso a paso:**

### **PASO 1: Ejecutar script de corrección SQL**
1. **Ve al SQL Editor de Supabase**
2. **Copia y ejecuta** todo el contenido de `DEBUG_STORAGE_SETUP.sql`
3. **Revisa las respuestas** para verificar que todo se configuró correctamente

### **PASO 2: Verificar configuración en consola**
1. **Ve a la aplicación** → `/admin/properties` → Crear/editar propiedad
2. **Abre la consola del navegador** (F12)
3. **Haz clic en el botón "🔍 Ejecutar Diagnósticos"** (aparece solo en desarrollo)
4. **Revisa el output en consola** - debe mostrar:
   - ✅ Usuario autenticado
   - ✅ Bucket property-media encontrado
   - ✅ Puede listar archivos en bucket

### **PASO 3: Probar upload con logging detallado**
1. **Selecciona una imagen pequeña** (máx 2MB) para probar
2. **Sube la imagen** y **revisa la consola**
3. **Busca estos mensajes** en orden:
   ```
   📤 Starting file upload process
   ✅ User authenticated
   🔍 Validating file
   ✅ File validation passed
   📤 Starting upload to Supabase Storage
   🔄 Calling supabase.storage.from...
   ✅ Upload successful
   ```

## 🛠️ **Soluciones a problemas comunes:**

### **❌ Error: "Usuario no autenticado"**
**Solución:** Hacer logout y login nuevamente
```bash
# En consola del navegador:
localStorage.clear()
# Luego recargar página y hacer login
```

### **❌ Error: "Access denied" o políticas RLS**
**Solución:** Ejecutar este SQL en Supabase:
```sql
-- Política simple y permisiva para testing
DROP POLICY IF EXISTS "Authenticated upload to property-media" ON storage.objects;

CREATE POLICY "Simple upload policy" ON storage.objects
FOR INSERT 
WITH CHECK (bucket_id = 'property-media');
```

### **❌ Error: "Bucket not found"**
**Solución:** Recrear bucket en Storage → Create bucket:
- Nombre: `property-media`
- ✅ Public bucket
- No restrictions

### **❌ Upload se queda cargando eternamente**
**Causas más comunes:**
1. **Políticas RLS incorrectas** → Ejecutar script SQL de corrección
2. **Usuario no autenticado** → Logout/login
3. **Bucket privado** → Marcar como público
4. **Archivo muy grande** → Probar con imagen < 2MB

## 🚀 **Test rápido:**

### **OPCIÓN A: Test manual**
1. Ejecutar `DEBUG_STORAGE_SETUP.sql` completo
2. Hacer logout/login en la app
3. Probar con imagen pequeña (< 2MB)

### **OPCIÓN B: Test directo desde consola**
Ejecutar en consola del navegador:
```javascript
// Verificar configuración
await storageService.diagnoseStorageSetup();

// Test de upload directo
const input = document.createElement('input');
input.type = 'file';
input.accept = 'image/*';
input.onchange = async (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    console.log('Testing upload...');
    const result = await storageService.uploadFiles(
      files, 
      'test-user', 
      'test-property'
    );
    console.log('Upload result:', result);
  }
};
input.click();
```

## 📱 **Si aún no funciona:**

1. **Revisar logs de Supabase**:
   - Dashboard → Authentication → Logs
   - Dashboard → Storage → Logs

2. **Verificar en Network tab**:
   - F12 → Network
   - Intentar upload
   - Buscar llamadas a `storage-v1.supabase.co`
   - Ver si hay errores 403, 401, 500

3. **Test básico de conectividad**:
   ```sql
   -- En SQL Editor de Supabase
   SELECT auth.uid(), auth.role();
   SELECT * FROM storage.buckets WHERE id = 'property-media';
   ```

---

## ✅ **Resultado esperado:**
- Upload exitoso con progreso visible
- Imagen aparece en la galería
- Archivo guardado en Storage → property-media
- Sin errores en consola

¿Necesitas ayuda con algún paso específico? 🤔 

**✅ Usuario autenticado: `true`**  
**✅ Supabase client: `true`**  
**❌ BUCKET 'property-media' NOT FOUND!**

El problema es que **el bucket existe** pero **no se puede acceder desde el código**. Esto es un problema de **permisos RLS en el storage**.

## 🔧 **SOLUCIÓN INMEDIATA:**

### **PASO 1: Ejecutar el script SQL de corrección**
Ve al **SQL Editor de Supabase** y ejecuta este SQL completo:

```sql
-- =============================================
-- SOLUCIÓN PARA BUCKET NO ENCONTRADO
-- =============================================

-- PASO 1: Verificar buckets existentes
SELECT id, name, public, created_at 
FROM storage.buckets;

-- PASO 2: Asegurar que el bucket sea público
UPDATE storage.buckets 
SET public = true 
WHERE id = 'property-media';

-- PASO 3: Eliminar todas las políticas problemáticas del storage
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Public read access to property-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload to property-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated update to property-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete to property-media" ON storage.objects;

-- PASO 4: Crear políticas SIMPLES y PERMISIVAS para testing
CREATE POLICY "Allow all operations on property-media" ON storage.objects
FOR ALL USING (bucket_id = 'property-media');

-- PASO 5: Verificar que las políticas se aplicaron
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' 
AND schemaname = 'storage';

-- PASO 6: Verificar bucket final
SELECT id, name, public 
FROM storage.buckets 
WHERE id = 'property-media';
```

### **PASO 2: Test inmediato**
Después de ejecutar el SQL:

1. **Vuelve a la app** → `/admin/properties`
2. **Haz clic en "🔍 Ejecutar Diagnósticos"** nuevamente
3. **Ahora debería mostrar:**
   ```
   🪣 Buckets: { foundPropertyMedia: true }
   📁 Bucket Access Test: { canList: true }
   📤 Test Upload Result: { success: true }
   ✅ UPLOAD TEST SUCCESSFUL!
   ```

### **PASO 3: Si aún no funciona**
Ejecuta este test directo en la **consola del navegador**:

```javascript
// Test directo de acceso al bucket
const testBucketAccess = async () => {
  console.log('🧪 Testing bucket access directly...');
  
  // Listar buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  console.log('Direct bucket test:', { buckets, bucketsError });
  
  // Test específico del bucket property-media
  const { data: files, error: listError } = await supabase.storage
    .from('property-media')
    .list('', { limit: 1 });
  console.log('Direct list test:', { files, listError });
};

await testBucketAccess();
```

---

## 🎯 **Diagnóstico:**

El problema **NO es el nombre del bucket** (no necesitas comillas). El problema es que **las políticas RLS están bloqueando el acceso** al listar buckets desde tu aplicación.

**¿Puedes ejecutar el script SQL y contarme qué resultado obtienes?** Una vez hecho eso, el diagnóstico debería pasar todas las pruebas ✅ 