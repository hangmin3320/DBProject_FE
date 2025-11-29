'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../../_store/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // Component to show when not authenticated
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  fallback = (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-gray-700 mb-4">Please log in to view this content</p>
        <a 
          href="/auth/signin" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md inline-block"
        >
          Sign In
        </a>
      </div>
    </div>
  )
}) => {
  const { isAuthenticated } = useAuthStore();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Delay showing content to ensure auth state is loaded from storage
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!showContent) {
    // Show a loading state while checking auth status
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>로딩 중...</p>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : <>{fallback}</>;
};

export default ProtectedRoute;