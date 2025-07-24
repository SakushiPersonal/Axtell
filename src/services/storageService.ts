import { supabase } from '../supabase/supabaseClient';
import { MediaFile } from '../types';

export interface UploadOptions {
  maxSizeImageMB?: number;
  maxSizeVideoMB?: number;
  maxImages?: number;
  maxVideos?: number;
}

const DEFAULT_OPTIONS: Required<UploadOptions> = {
  maxSizeImageMB: 10,
  maxSizeVideoMB: 100,
  maxImages: 15,
  maxVideos: 3
};

class StorageService {
  private bucketName = 'property-media';

  /**
   * Valida si un archivo es de imagen
   */
  private isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Valida si un archivo es de video
   */
  private isVideoFile(file: File): boolean {
    return file.type.startsWith('video/');
  }

  /**
   * Valida el tipo y tamaño de archivo
   */
  private validateFile(file: File, options: Required<UploadOptions>): { valid: boolean; error?: string } {
    console.log('🔍 Validating file:', {
      name: file.name,
      type: file.type,
      size: file.size,
      sizeInMB: (file.size / 1024 / 1024).toFixed(2)
    });

    const isImage = this.isImageFile(file);
    const isVideo = this.isVideoFile(file);

    if (!isImage && !isVideo) {
      console.error('❌ File validation failed: Invalid file type');
      return { valid: false, error: 'Solo se permiten archivos de imagen o video' };
    }

    if (isImage) {
      const maxSizeBytes = options.maxSizeImageMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        console.error('❌ Image size validation failed:', {
          fileSize: file.size,
          maxAllowed: maxSizeBytes,
          fileSizeMB: (file.size / 1024 / 1024).toFixed(2),
          maxAllowedMB: options.maxSizeImageMB
        });
        return { valid: false, error: `La imagen "${file.name}" es demasiado grande. Máximo ${options.maxSizeImageMB}MB` };
      }
    }

    if (isVideo) {
      const maxSizeBytes = options.maxSizeVideoMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        console.error('❌ Video size validation failed:', {
          fileSize: file.size,
          maxAllowed: maxSizeBytes,
          fileSizeMB: (file.size / 1024 / 1024).toFixed(2),
          maxAllowedMB: options.maxSizeVideoMB
        });
        return { valid: false, error: `El video "${file.name}" es demasiado grande. Máximo ${options.maxSizeVideoMB}MB` };
      }
    }

    console.log('✅ File validation passed');
    return { valid: true };
  }

  /**
   * Genera la ruta del archivo en el storage
   */
  private generateFilePath(userId: string, propertyId: string, fileName: string, type: 'image' | 'video'): string {
    const timestamp = Date.now();
    const extension = fileName.split('.').pop();
    const cleanName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filePath = `${userId}/${propertyId}/${type}s/${timestamp}_${cleanName}`;
    
    console.log('📁 Generated file path:', filePath);
    return filePath;
  }

  /**
   * Sube múltiples archivos y retorna MediaFiles
   */
  async uploadFiles(
    files: FileList | File[],
    userId: string,
    propertyId: string,
    existingMedia: MediaFile[] = [],
    options: UploadOptions = {}
  ): Promise<{ success: boolean; mediaFiles?: MediaFile[]; error?: string }> {
    console.log('🚀 Starting file upload process:', {
      fileCount: files.length,
      userId,
      propertyId,
      existingMediaCount: existingMedia.length,
      options
    });

    const opts = { ...DEFAULT_OPTIONS, ...options };
    const fileArray = Array.from(files);
    
    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('❌ Authentication check failed:', authError);
      return { success: false, error: 'Usuario no autenticado' };
    }
    
    console.log('✅ User authenticated:', {
      userId: user.id,
      email: user.email
    });
    
    // Validar límites existentes
    const existingImages = existingMedia.filter(m => m.type === 'image').length;
    const existingVideos = existingMedia.filter(m => m.type === 'video').length;
    
    const newImages = fileArray.filter(f => this.isImageFile(f));
    const newVideos = fileArray.filter(f => this.isVideoFile(f));

    console.log('📊 Media count validation:', {
      existingImages,
      existingVideos,
      newImages: newImages.length,
      newVideos: newVideos.length,
      limits: {
        maxImages: opts.maxImages,
        maxVideos: opts.maxVideos
      }
    });

    if (existingImages + newImages.length > opts.maxImages) {
      const error = `Máximo ${opts.maxImages} imágenes permitidas`;
      console.error('❌ Image limit exceeded:', error);
      return { success: false, error };
    }

    if (existingVideos + newVideos.length > opts.maxVideos) {
      const error = `Máximo ${opts.maxVideos} videos permitidos`;
      console.error('❌ Video limit exceeded:', error);
      return { success: false, error };
    }

    // Validar cada archivo
    for (const file of fileArray) {
      const validation = this.validateFile(file, opts);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }
    }

    console.log('✅ All files validated successfully');

    try {
      console.log('📤 Starting upload to Supabase Storage...');
      
      const uploadPromises = fileArray.map(async (file, index): Promise<MediaFile> => {
        console.log(`📤 Uploading file ${index + 1}/${fileArray.length}:`, file.name);
        
        const isImage = this.isImageFile(file);
        const type: 'image' | 'video' = isImage ? 'image' : 'video';
        const filePath = this.generateFilePath(userId, propertyId, file.name, type);

        console.log(`🔄 Calling supabase.storage.from('${this.bucketName}').upload('${filePath}', file)`);
        
        const { data, error } = await supabase.storage
          .from(this.bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error(`❌ Upload failed for file ${file.name}:`, {
            error: error.message,
            details: error,
            filePath,
            fileSize: file.size,
            fileType: file.type
          });
          throw error;
        }

        console.log(`✅ Upload successful for file ${file.name}:`, data);

        console.log(`🔗 Getting public URL for: ${filePath}`);
        const { data: publicUrlData } = supabase.storage
          .from(this.bucketName)
          .getPublicUrl(filePath);

        console.log(`✅ Public URL generated:`, publicUrlData.publicUrl);

        const mediaFile: MediaFile = {
          id: crypto.randomUUID(),
          url: publicUrlData.publicUrl,
          type,
          name: file.name,
          size: file.size,
          uploadedAt: new Date().toISOString()
        };

        console.log(`✅ MediaFile created:`, mediaFile);
        return mediaFile;
      });

      console.log('⏳ Waiting for all uploads to complete...');
      const mediaFiles = await Promise.all(uploadPromises);
      
      console.log('🎉 All uploads completed successfully:', {
        uploadedCount: mediaFiles.length,
        mediaFiles: mediaFiles.map(f => ({ name: f.name, type: f.type, url: f.url }))
      });
      
      return { success: true, mediaFiles };

    } catch (error) {
      console.error('💥 Upload process failed:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        details: error
      });
      return { success: false, error: 'Error al subir archivos. Inténtalo de nuevo.' };
    }
  }

  /**
   * Elimina un archivo del storage
   */
  async deleteFile(fileUrl: string): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🗑️ Deleting file:', fileUrl);
      
      // Extraer la ruta del archivo de la URL pública
      const url = new URL(fileUrl);
      const pathParts = url.pathname.split('/');
      const filePath = pathParts.slice(-4).join('/'); // user/property/type/filename

      console.log('📁 Extracted file path:', filePath);

      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        console.error('❌ Delete failed:', error);
        throw error;
      }

      console.log('✅ File deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('💥 Delete process failed:', error);
      return { success: false, error: 'Error al eliminar archivo' };
    }
  }

  /**
   * Elimina múltiples archivos
   */
  async deleteFiles(mediaFiles: MediaFile[]): Promise<{ success: boolean; error?: string }> {
    try {
      console.log('🗑️ Deleting multiple files:', mediaFiles.length);
      
      const deletePromises = mediaFiles.map(file => this.deleteFile(file.url));
      const results = await Promise.all(deletePromises);
      
      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        console.error('❌ Some deletes failed:', failed.length);
        return { success: false, error: `Error al eliminar ${failed.length} archivos` };
      }

      console.log('✅ All files deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('💥 Multi-delete process failed:', error);
      return { success: false, error: 'Error al eliminar archivos' };
    }
  }

  /**
   * Obtiene la URL pública de un archivo
   */
  getPublicUrl(filePath: string): string {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }

  /**
   * Migra una imagen Base64 a Storage
   */
  async migrateBase64ToStorage(
    base64Data: string,
    userId: string,
    propertyId: string,
    fileName: string = 'migrated_image.jpg'
  ): Promise<{ success: boolean; mediaFile?: MediaFile; error?: string }> {
    try {
      console.log('🔄 Migrating Base64 to storage:', { fileName, userId, propertyId });
      
      // Convertir Base64 a Blob
      const response = await fetch(base64Data);
      const blob = await response.blob();
      
      // Crear File object
      const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
      
      const result = await this.uploadFiles([file], userId, propertyId);
      
      if (result.success && result.mediaFiles && result.mediaFiles.length > 0) {
        console.log('✅ Base64 migration successful');
        return { success: true, mediaFile: result.mediaFiles[0] };
      } else {
        console.error('❌ Base64 migration failed:', result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('💥 Base64 migration process failed:', error);
      return { success: false, error: 'Error al migrar imagen' };
    }
  }

  /**
   * Función de diagnóstico para verificar la configuración
   */
  async diagnoseStorageSetup(): Promise<void> {
    console.log('🔍 DIAGNOSING STORAGE SETUP...');
    
    try {
      console.log('🔄 Step 1: Checking Supabase client configuration...');
      console.log('📊 Supabase client initialized:', !!supabase);
      
      // Verificar variables de entorno
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      console.log('🔧 Environment variables:', {
        hasUrl: !!supabaseUrl,
        urlStart: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'undefined',
        hasKey: !!supabaseKey,
        keyStart: supabaseKey ? supabaseKey.substring(0, 20) + '...' : 'undefined'
      });

      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ MISSING ENVIRONMENT VARIABLES!');
        console.log('💡 Check your .env file or environment variables');
        return;
      }
      
      console.log('🔄 Step 2: Testing basic connectivity...');
      
      // Test simple de conectividad sin auth
      try {
        const { data: { session }, error: sessionError } = await Promise.race([
          supabase.auth.getSession(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Session timeout')), 5000)
          )
        ]) as any;
        
        console.log('📡 Session test:', {
          success: !sessionError,
          hasSession: !!session,
          error: sessionError?.message
        });
      } catch (sessionErr) {
        console.error('❌ SESSION TEST FAILED:', sessionErr);
        console.log('💡 This suggests connectivity issues with Supabase');
      }
      
      console.log('🔄 Step 3: Testing auth.getUser() with shorter timeout...');
      
      try {
        // Usar Promise.race para timeout más corto
        const authPromise = supabase.auth.getUser();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout after 5 seconds')), 5000)
        );
        
        const authResult = await Promise.race([authPromise, timeoutPromise]) as any;
        const { data: { user }, error: authError } = authResult;
        
        console.log('👤 Auth Status:', {
          authenticated: !!user,
          user: user ? { 
            id: user.id, 
            email: user.email,
            aud: user.aud,
            role: user.role,
            created_at: user.created_at
          } : null,
          error: authError?.message
        });

        if (!user) {
          console.error('❌ USER NOT AUTHENTICATED');
          console.log('💡 Try: Clear browser storage and login again');
          console.log('🔧 Commands to run in console:');
          console.log('   localStorage.clear();');
          console.log('   sessionStorage.clear();');
          console.log('   Then reload and login');
          return;
        }

        console.log('🔄 Step 4: Testing storage directly...');
        const bucketsPromise = supabase.storage.listBuckets();
        const bucketTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Bucket list timeout after 5 seconds')), 5000)
        );
        
        const bucketResult = await Promise.race([bucketsPromise, bucketTimeoutPromise]) as any;
        const { data: buckets, error: bucketsError } = bucketResult;
        
        console.log('🪣 Buckets:', {
          buckets: buckets?.map((b: any) => ({ id: b.id, name: b.name, public: b.public })),
          error: bucketsError?.message,
          foundPropertyMedia: buckets?.some((b: any) => b.id === this.bucketName)
        });

        if (bucketsError) {
          console.error('❌ BUCKET LIST ERROR:', bucketsError);
          console.log('💡 This suggests RLS issues - try the SQL policy fix');
          return;
        }

        if (!buckets?.some((b: any) => b.id === this.bucketName)) {
          console.error(`❌ BUCKET '${this.bucketName}' NOT FOUND!`);
          console.log('💡 Create the bucket in Supabase Dashboard → Storage');
          return;
        }

        console.log('🔄 Step 5: Testing bucket access...');
        const listPromise = supabase.storage.from(this.bucketName).list('', { limit: 1 });
        const listTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('List files timeout after 5 seconds')), 5000)
        );
        
        const listResult = await Promise.race([listPromise, listTimeoutPromise]) as any;
        const { data: files, error: listError } = listResult;
        
        console.log('📁 Bucket Access Test:', {
          canList: !listError,
          error: listError?.message,
          errorDetails: listError,
          fileCount: files?.length || 0
        });

        if (listError) {
          console.error('❌ BUCKET ACCESS ERROR:', listError);
          console.log('💡 RLS policy issue - run the storage policy SQL script');
          return;
        }

        console.log('🔄 Step 6: Testing file upload...');
        // Crear un archivo de prueba muy pequeño
        const testBlob = new Blob(['test'], { type: 'text/plain' });
        const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
        const testPath = `test/${Date.now()}_diagnostic_test.txt`;
        
        const uploadPromise = supabase.storage
          .from(this.bucketName)
          .upload(testPath, testFile);
        
        const uploadTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Upload timeout after 10 seconds')), 10000)
        );
        
        const uploadResult = await Promise.race([uploadPromise, uploadTimeoutPromise]) as any;
        const { data: uploadData, error: uploadError } = uploadResult;
        
        console.log('📤 Test Upload Result:', {
          success: !uploadError,
          uploadData,
          error: uploadError?.message,
          errorDetails: uploadError
        });

        if (uploadError) {
          console.error('❌ UPLOAD TEST FAILED:', uploadError);
          console.log('💡 RLS policy preventing uploads');
        } else {
          console.log('✅ UPLOAD TEST SUCCESSFUL!');
          
          // Limpiar archivo de prueba
          await supabase.storage.from(this.bucketName).remove([testPath]);
          console.log('🧹 Test file cleaned up');
        }

        console.log('🎉 DIAGNOSIS COMPLETE!');
        
      } catch (authError) {
        console.error('❌ AUTH TIMEOUT OR ERROR:', authError);
        console.log('💡 Possible solutions:');
        console.log('   1. Check internet connection');
        console.log('   2. Verify Supabase project URL and key');
        console.log('   3. Check browser network tab for failed requests');
        console.log('   4. Try clearing browser cache and storage');
      }
      
    } catch (error) {
      console.error('💥 Diagnosis failed with error:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      });
    }
  }

  /**
   * Test simple de conectividad
   */
  async testConnectivity(): Promise<void> {
    console.log('🌐 TESTING SUPABASE CONNECTIVITY...');
    
    try {
      // Test básico de ping
      const startTime = Date.now();
      const { data, error } = await supabase.from('profiles').select('count').limit(1);
      const endTime = Date.now();
      
      console.log('🏓 Basic query test:', {
        success: !error,
        responseTime: `${endTime - startTime}ms`,
        error: error?.message
      });
      
    } catch (error) {
      console.error('❌ Connectivity test failed:', error);
    }
  }
}

export const storageService = new StorageService(); 