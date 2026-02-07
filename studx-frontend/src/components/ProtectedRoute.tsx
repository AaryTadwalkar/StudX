import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onRedirectToLogin: () => void;
}

/**
 * ProtectedRoute Component
 * Wraps any component that requires authentication
 * Automatically redirects to login if user is not authenticated
 * 
 * Usage in App.tsx:
 * case 'marketplace': 
 *   return (
 *     <ProtectedRoute onRedirectToLogin={() => setState('auth')}>
 *       <Marketplace ... />
 *     </ProtectedRoute>
 *   );
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, onRedirectToLogin }) => {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      // Not authenticated, redirect to login
      onRedirectToLogin();
    }
  }, [isAuthenticated, loading, onRedirectToLogin]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated, don't render children
  if (!isAuthenticated) {
    return null;
  }

  // Authenticated, render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
