'use client';

import React from 'react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  fallback?: string;
}

const Avatar = ({ src, alt = 'Avatar', size = 'md', className = '', fallback }: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl',
  };

  if (!src && !fallback) {
    // Default avatar (using a simple icon)
    return (
      <div className={`rounded-full bg-gray-200 flex items-center justify-center ${sizeClasses[size]} ${className}`}>
        <span className="text-gray-500 font-medium">U</span>
      </div>
    );
  }

  return (
    <div className={`rounded-full bg-gray-200 flex items-center justify-center overflow-hidden ${sizeClasses[size]} ${className}`}>
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover"
          onError={(e) => {
            // If image fails to load, show fallback
            const target = e.target as HTMLImageElement;
            target.onerror = null; // Prevent infinite loop
            target.style.display = 'none';
            
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = `<span class="text-gray-500 font-medium">${fallback?.charAt(0) || 'U'}</span>`;
            }
          }}
        />
      ) : (
        <span className="text-gray-500 font-medium">{fallback?.charAt(0) || 'U'}</span>
      )}
    </div>
  );
};

export { Avatar };