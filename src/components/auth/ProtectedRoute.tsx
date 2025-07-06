'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireProfile?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  redirectTo = '/login',
  requireProfile = false 
}) => {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // User is not authenticated, redirect to login
        router.push(redirectTo);
        return;
      }

      if (requireProfile) {
        if (!userProfile) {
          // User is authenticated but profile is missing
          router.push('/profile/setup');
          return;
        }
        
        // Check if profile is incomplete (less than 50% complete or missing essential fields)
        const isProfileIncomplete = 
          !userProfile.personalInfo?.firstName ||
          !userProfile.personalInfo?.lastName ||
          !userProfile.summary?.headline ||
          (userProfile.metadata?.completionPercentage || 0) < 50;
          
        if (isProfileIncomplete) {
          router.push('/profile/setup');
          return;
        }
      }
    }
  }, [user, userProfile, loading, router, redirectTo, requireProfile]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null;
  }

  // Don't render children if profile is required but missing or incomplete
  if (requireProfile) {
    if (!userProfile) {
      return null;
    }
    
    const isProfileIncomplete = 
      !userProfile.personalInfo?.firstName ||
      !userProfile.personalInfo?.lastName ||
      !userProfile.summary?.headline ||
      (userProfile.metadata?.completionPercentage || 0) < 50;
      
    if (isProfileIncomplete) {
      return null;
    }
  }

  // User is authenticated and profile requirements are met
  return <>{children}</>;
};

export default ProtectedRoute;