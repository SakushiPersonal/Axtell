import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'card' | 'text' | 'circle' | 'rectangular';
  width?: string;
  height?: string;
  lines?: number;
  animate?: boolean;
}

export function Skeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  animate = true
}: Omit<SkeletonLoaderProps, 'lines'>) {
  const baseClasses = `bg-gray-200 ${animate ? 'animate-pulse' : ''}`;
  
  const variantClasses = {
    card: 'rounded-lg',
    text: 'rounded',
    circle: 'rounded-full',
    rectangular: 'rounded'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = width;
  if (height) style.height = height;

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

export function SkeletonText({ 
  className = '', 
  lines = 1,
  animate = true 
}: Pick<SkeletonLoaderProps, 'className' | 'lines' | 'animate'>) {
  return (
    <div className={className}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          height="1rem"
          className={`${index < lines - 1 ? 'mb-2' : ''} ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
          animate={animate}
        />
      ))}
    </div>
  );
}

export function PropertyCardSkeleton({ animate = true }: { animate?: boolean }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Image skeleton */}
      <Skeleton 
        variant="rectangular" 
        height="12rem" 
        className="w-full"
        animate={animate}
      />
      
      {/* Content skeleton */}
      <div className="p-4">
        {/* Title */}
        <Skeleton 
          variant="text" 
          height="1.25rem" 
          className="w-3/4 mb-2"
          animate={animate}
        />
        
        {/* Location */}
        <Skeleton 
          variant="text" 
          height="0.875rem" 
          className="w-1/2 mb-3"
          animate={animate}
        />
        
        {/* Stats */}
        <div className="flex justify-between mb-3">
          <Skeleton 
            variant="text" 
            height="0.875rem" 
            className="w-12"
            animate={animate}
          />
          <Skeleton 
            variant="text" 
            height="0.875rem" 
            className="w-12"
            animate={animate}
          />
          <Skeleton 
            variant="text" 
            height="0.875rem" 
            className="w-16"
            animate={animate}
          />
        </div>
        
        {/* Price */}
        <div className="flex justify-between items-end">
          <Skeleton 
            variant="text" 
            height="1.5rem" 
            className="w-24"
            animate={animate}
          />
          <Skeleton 
            variant="text" 
            height="1rem" 
            className="w-16"
            animate={animate}
          />
        </div>
      </div>
    </div>
  );
}

export function PropertyDetailSkeleton({ animate = true }: { animate?: boolean }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header skeleton */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <Skeleton height="2rem" className="w-2/3 mb-2" animate={animate} />
              <Skeleton height="1rem" className="w-1/2 mb-4" animate={animate} />
            </div>
            <div className="flex gap-3 ml-4">
              <Skeleton variant="circle" width="3rem" height="3rem" animate={animate} />
              <Skeleton variant="circle" width="3rem" height="3rem" animate={animate} />
            </div>
          </div>
          <Skeleton height="2rem" className="w-32" animate={animate} />
        </div>

        {/* Media skeleton */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <Skeleton height="24rem" className="w-full" animate={animate} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Content skeleton */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-8">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="text-center">
                    <Skeleton variant="circle" width="3rem" height="3rem" className="mx-auto mb-2" animate={animate} />
                    <Skeleton height="1.5rem" className="w-8 mx-auto mb-1" animate={animate} />
                    <Skeleton height="0.875rem" className="w-16 mx-auto" animate={animate} />
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="mb-8">
                <Skeleton height="1.25rem" className="w-32 mb-4" animate={animate} />
                <SkeletonText lines={4} animate={animate} />
              </div>

              {/* Features */}
              <div>
                <Skeleton height="1.25rem" className="w-40 mb-4" animate={animate} />
                <div className="grid grid-cols-2 gap-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} height="1rem" className="w-full" animate={animate} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <Skeleton height="1.25rem" className="w-32 mb-6" animate={animate} />
              <div className="space-y-4">
                <Skeleton height="3rem" className="w-full" animate={animate} />
                <div className="flex gap-3">
                  <Skeleton height="3rem" className="flex-1" animate={animate} />
                  <Skeleton height="3rem" className="flex-1" animate={animate} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Skeleton; 