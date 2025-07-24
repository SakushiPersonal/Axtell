import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize2, Download, Share } from 'lucide-react';
import { MediaFile } from '../types';

interface MediaGalleryProps {
  media: (MediaFile | { id: string; url: string; type: 'image' | 'video'; name: string })[];
  initialIndex?: number;
  showThumbnails?: boolean;
  className?: string;
  onShare?: (mediaUrl: string, mediaName: string) => void;
}

interface LightboxProps {
  media: (MediaFile | { id: string; url: string; type: 'image' | 'video'; name: string })[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onShare?: (mediaUrl: string, mediaName: string) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ 
  media, 
  currentIndex, 
  isOpen, 
  onClose, 
  onNavigate,
  onShare 
}) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);

  const currentMedia = media[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) onNavigate(currentIndex - 1);
          break;
        case 'ArrowRight':
          if (currentIndex < media.length - 1) onNavigate(currentIndex + 1);
          break;
        case ' ':
          e.preventDefault();
          if (currentMedia.type === 'video' && videoElement) {
            if (isVideoPlaying) {
              videoElement.pause();
            } else {
              videoElement.play();
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex, media.length, currentMedia.type, isVideoPlaying, videoElement, onClose, onNavigate]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleVideoRef = useCallback((video: HTMLVideoElement | null) => {
    setVideoElement(video);
    if (video) {
      video.addEventListener('play', () => setIsVideoPlaying(true));
      video.addEventListener('pause', () => setIsVideoPlaying(false));
    }
  }, []);

  const toggleVideoPlayback = () => {
    if (videoElement) {
      if (isVideoPlaying) {
        videoElement.pause();
      } else {
        videoElement.play();
      }
    }
  };

  const toggleVideoMute = () => {
    if (videoElement) {
      videoElement.muted = !videoElement.muted;
      setIsVideoMuted(videoElement.muted);
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentMedia.url;
    link.download = currentMedia.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    if (onShare) {
      onShare(currentMedia.url, currentMedia.name);
    }
  };

  if (!isOpen || !currentMedia) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center">
      {/* Background overlay */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
      />
      
      {/* Main content */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Media content */}
        <div className="relative max-w-7xl max-h-full flex items-center justify-center">
          {currentMedia.type === 'image' ? (
            <img
              src={currentMedia.url}
              alt={currentMedia.name}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ maxHeight: 'calc(100vh - 8rem)' }}
            />
          ) : (
            <div className="relative">
              <video
                ref={handleVideoRef}
                src={currentMedia.url}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                style={{ maxHeight: 'calc(100vh - 8rem)', maxWidth: 'calc(100vw - 8rem)' }}
                controls={false}
                muted={isVideoMuted}
                onClick={toggleVideoPlayback}
              />
              
              {/* Custom video controls */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 rounded-lg p-3 flex items-center gap-3">
                <button
                  onClick={toggleVideoPlayback}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                
                <button
                  onClick={toggleVideoMute}
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  {isVideoMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                
                <div className="flex-1" />
                
                <span className="text-white text-sm">{currentMedia.name}</span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation arrows */}
        {media.length > 1 && (
          <>
            <button
              onClick={() => onNavigate(currentIndex > 0 ? currentIndex - 1 : media.length - 1)}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => onNavigate(currentIndex < media.length - 1 ? currentIndex + 1 : 0)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all z-10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Top controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
            {currentIndex + 1} / {media.length}
          </div>
          
          <div className="flex items-center gap-2">
            {onShare && (
              <button
                onClick={handleShare}
                className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-all"
                title="Compartir"
              >
                <Share className="w-5 h-5" />
              </button>
            )}
            
            <button
              onClick={handleDownload}
              className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-all"
              title="Descargar"
            >
              <Download className="w-5 h-5" />
            </button>
            
            <button
              onClick={onClose}
              className="bg-black bg-opacity-50 text-white p-2 rounded-lg hover:bg-opacity-70 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Thumbnails bar */}
        {media.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 rounded-lg p-2 max-w-full overflow-x-auto">
            <div className="flex gap-2">
              {media.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(index)}
                  className={`relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                    index === currentIndex ? 'border-white' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MediaGallery: React.FC<MediaGalleryProps> = ({ 
  media, 
  initialIndex = 0, 
  showThumbnails = true,
  className = "",
  onShare
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const navigateToIndex = (index: number) => {
    setCurrentIndex(index);
  };

  if (!media || media.length === 0) {
    return (
      <div className={`bg-gray-100 rounded-lg aspect-video flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-center">
          <div className="w-12 h-12 mx-auto mb-2 bg-gray-300 rounded-lg flex items-center justify-center">
            📷
          </div>
          <p>Sin multimedia</p>
        </div>
      </div>
    );
  }

  const mainMedia = media[0];

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Main media display */}
        <div 
          className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          {mainMedia.type === 'image' ? (
            <img
              src={mainMedia.url}
              alt={mainMedia.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="relative w-full h-full">
              <video
                src={mainMedia.url}
                className="w-full h-full object-cover"
                poster=""
                muted
              />
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="bg-white bg-opacity-90 rounded-full p-4 group-hover:bg-opacity-100 transition-all">
                  <Play className="w-8 h-8 text-gray-800" />
                </div>
              </div>
            </div>
          )}
          
          {/* Media count overlay */}
          {media.length > 1 && (
            <div className="absolute top-3 right-3 bg-black bg-opacity-60 text-white px-2 py-1 rounded-lg text-sm">
              +{media.length - 1}
            </div>
          )}
          
          {/* Expand icon */}
          <div className="absolute bottom-3 right-3 bg-black bg-opacity-60 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 className="w-4 h-4" />
          </div>
        </div>

        {/* Thumbnails grid */}
        {showThumbnails && media.length > 1 && (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {media.slice(1, 5).map((item, index) => (
              <button
                key={item.id}
                onClick={() => openLightbox(index + 1)}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:opacity-80 transition-opacity"
              >
                {item.type === 'image' ? (
                  <img
                    src={item.url}
                    alt={`Media ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                )}
                
                {/* Show +N indicator on last thumbnail if there are more items */}
                {index === 3 && media.length > 5 && (
                  <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-semibold">
                    +{media.length - 5}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        media={media}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
        onNavigate={navigateToIndex}
        onShare={onShare}
      />
    </>
  );
};

export default MediaGallery; 