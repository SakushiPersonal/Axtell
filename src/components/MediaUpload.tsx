import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Video, AlertCircle, Play, FileIcon } from 'lucide-react';
import { MediaFile } from '../types';
import { storageService, UploadOptions } from '../services/storageService';
import { supabase } from '../supabase/supabaseClient';

interface MediaUploadProps {
  media: MediaFile[];
  onChange: (media: MediaFile[]) => void;
  userId: string;
  propertyId: string;
  options?: UploadOptions;
  disabled?: boolean;
}

export default function MediaUpload({ 
  media, 
  onChange, 
  userId,
  propertyId,
  options = {},
  disabled = false
}: MediaUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const defaultOptions: Required<UploadOptions> = {
    maxSizeImageMB: 10,
    maxSizeVideoMB: 100,
    maxImages: 15,
    maxVideos: 3
  };

  const opts = { ...defaultOptions, ...options };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || disabled) return;

    console.log('📤 MediaUpload: Starting file selection:', {
      fileCount: files.length,
      userId,
      propertyId,
      disabled
    });

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await storageService.uploadFiles(
        files, 
        userId, 
        propertyId, 
        media, 
        opts
      );

      if (result.success && result.mediaFiles) {
        console.log('✅ MediaUpload: Upload successful, updating media');
        onChange([...media, ...result.mediaFiles]);
        setUploadProgress(100);
      } else {
        console.error('❌ MediaUpload: Upload failed:', result.error);
        setError(result.error || 'Error al subir archivos');
      }
    } catch (err) {
      console.error('💥 MediaUpload: Unexpected error:', err);
      setError('Error inesperado al subir archivos');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  // Función de diagnóstico para debugging
  const runDiagnostics = async () => {
    console.log('🔍 MediaUpload: Running diagnostics...');
    await storageService.diagnoseStorageSetup();
  };

  // Test de conectividad básica
  const testConnectivity = async () => {
    console.log('🌐 MediaUpload: Testing connectivity...');
    await storageService.testConnectivity();
  };

  // Test directo al bucket (omitiendo listBuckets)
  const testDirectUpload = async () => {
    console.log('🚀 MediaUpload: Testing direct bucket access...');
    
    try {
      console.log('📤 Step 1: Testing direct bucket access...');
      
      // Test directo - listar archivos sin verificar buckets primero
      const { data: files, error: listError } = await supabase.storage
        .from('property-media')
        .list('', { limit: 1 });
      
      console.log('📁 Direct bucket access result:', {
        success: !listError,
        error: listError?.message,
        fileCount: files?.length || 0
      });
      
      if (listError) {
        console.error('❌ Direct bucket access failed:', listError);
        return;
      }
      
      console.log('📤 Step 2: Testing direct upload...');
      
      // Test de upload directo
      const testBlob = new Blob(['direct-test'], { type: 'text/plain' });
      const testFile = new File([testBlob], 'direct-test.txt', { type: 'text/plain' });
      const testPath = `test/direct_${Date.now()}.txt`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('property-media')
        .upload(testPath, testFile);
      
      console.log('📤 Direct upload result:', {
        success: !uploadError,
        uploadData,
        error: uploadError?.message
      });
      
      if (uploadError) {
        console.error('❌ Direct upload failed:', uploadError);
      } else {
        console.log('✅ DIRECT UPLOAD SUCCESSFUL! Problem is only with listBuckets()');
        
        // Limpiar archivo de prueba
        await supabase.storage.from('property-media').remove([testPath]);
        console.log('🧹 Test file cleaned up');
      }
      
    } catch (error) {
      console.error('💥 Direct test failed:', error);
    }
  };

  // Debug de los datos actuales
  const debugMediaData = () => {
    console.log('🐛 DEBUG: Media data analysis:', {
      currentMedia: media,
      mediaCount: media.length,
      images: media.filter(m => m.type === 'image'),
      videos: media.filter(m => m.type === 'video'),
      userId,
      propertyId,
      isEditing: propertyId.includes('temp') ? false : true
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeMedia = async (index: number) => {
    if (disabled) return;

    const mediaToRemove = media[index];
    
    // Eliminar del storage
    const result = await storageService.deleteFile(mediaToRemove.url);
    
    if (result.success) {
      const newMedia = media.filter((_, i) => i !== index);
      onChange(newMedia);
    } else {
      setError(result.error || 'Error al eliminar archivo');
    }
  };

  const openFileDialog = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const getAcceptedTypes = () => {
    return [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
      'video/mp4', 'video/webm', 'video/mov', 'video/quicktime'
    ].join(',');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const images = media.filter(m => m.type === 'image');
  const videos = media.filter(m => m.type === 'video');

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          disabled 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
            : dragOver
            ? 'border-red-500 bg-red-50 cursor-pointer'
            : 'border-gray-300 hover:border-red-400 hover:bg-gray-50 cursor-pointer'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={getAcceptedTypes()}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="space-y-2">
          <Upload className={`w-12 h-12 mx-auto ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
          <div>
            <p className={`text-lg font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
              {uploading ? `Subiendo archivos... ${uploadProgress}%` : 'Subir imágenes y videos'}
            </p>
            <p className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
              Arrastra y suelta archivos aquí o haz clic para seleccionar
            </p>
            <div className={`text-xs mt-1 space-y-1 ${disabled ? 'text-gray-400' : 'text-gray-500'}`}>
              <p>📷 Imágenes: Máx {opts.maxImages} archivos, {opts.maxSizeImageMB}MB c/u</p>
              <p>🎥 Videos: Máx {opts.maxVideos} archivos, {opts.maxSizeVideoMB}MB c/u</p>
              <p>Formatos: JPG, PNG, WebP, GIF, MP4, WebM, MOV</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        {uploading && uploadProgress > 0 && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-700 text-sm flex-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Media Preview Grid */}
      {media.length > 0 && (
        <div className="space-y-4">
          {/* Images Section */}
          {images.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <ImageIcon className="w-4 h-4 mr-1" />
                Imágenes ({images.length}/{opts.maxImages})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((file, index) => (
                  <div key={file.id} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {!disabled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const imageIndex = media.findIndex(m => m.id === file.id);
                          removeMedia(imageIndex);
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {formatFileSize(file.size)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Videos Section */}
          {videos.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <Video className="w-4 h-4 mr-1" />
                Videos ({videos.length}/{opts.maxVideos})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((file) => (
                  <div key={file.id} className="relative group bg-gray-100 rounded-lg overflow-hidden">
                    <video
                      src={file.url}
                      className="w-full h-48 object-cover"
                      controls
                      preload="metadata"
                    >
                      Tu navegador no soporta videos.
                    </video>
                    {!disabled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const videoIndex = media.findIndex(m => m.id === file.id);
                          removeMedia(videoIndex);
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                      <Play className="w-3 h-3" />
                      <span>{formatFileSize(file.size)}</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {media.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <div className="flex justify-center space-x-4 mb-4">
            <ImageIcon className="w-12 h-12 text-gray-300" />
            <Video className="w-12 h-12 text-gray-300" />
          </div>
          <p>No hay archivos multimedia seleccionados</p>
        </div>
      )}

      {/* Media Counter */}
      <div className="text-sm text-gray-600 text-center space-x-4">
        <span>📷 {images.length} de {opts.maxImages} imágenes</span>
        <span>🎥 {videos.length} de {opts.maxVideos} videos</span>
      </div>

      {/* Debug Buttons - Solo en desarrollo */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-center mt-4 space-x-2">
          <button
            onClick={testConnectivity}
            className="text-xs bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded border text-blue-600"
          >
            🌐 Test Conectividad
          </button>
          <button
            onClick={testDirectUpload}
            className="text-xs bg-green-100 hover:bg-green-200 px-3 py-1 rounded border text-green-600"
          >
            🚀 Test Upload Directo
          </button>
          <button
            onClick={debugMediaData}
            className="text-xs bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded border text-purple-600"
          >
            🐛 Debug Datos
          </button>
          <button
            onClick={runDiagnostics}
            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded border text-gray-600"
          >
            🔍 Diagnóstico Completo
          </button>
          <button
            onClick={debugMediaData}
            className="text-xs bg-purple-100 hover:bg-purple-200 px-3 py-1 rounded border text-purple-600"
          >
            🐛 Debug Datos
          </button>
        </div>
      )}
    </div>
  );
} 