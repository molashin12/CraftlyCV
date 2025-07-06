'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { User, LogOut, FileText, Target, BarChart3, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function DashboardPage() {
  const { user, userProfile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  };

  return (
    <ProtectedRoute requireProfile={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: "radial-gradient(circle at 30px 30px, rgba(255,255,255,0.1) 2px, transparent 2px)", backgroundSize: "60px 60px"}} />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-500" />
        {/* Header */}
        <header className="relative bg-white/10 backdrop-blur-xl border-b border-white/20 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center">
                <Image
                  src="/logo.svg"
                  alt="CraftlyCV"
                  width={120}
                  height={40}
                  className="h-10 w-auto filter brightness-0 invert"
                />
              </Link>

              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <div className="text-white">
                  <p className="text-sm font-medium">
                    Welcome, {userProfile?.personalInfo.firstName || user?.displayName || user?.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
            <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4">Profile</h2>
                <p className="text-blue-100 mb-4">
                  Complete your profile to get better AI-generated resumes.
                </p>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-blue-100 mb-2">
                    <span>Completion</span>
                    <span>{userProfile?.metadata.completionPercentage || 0}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${userProfile?.metadata.completionPercentage || 0}%` }}
                    />
                  </div>
                </div>
                <Link
                  href="/profile"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Edit Profile
                </Link>
              </div>

              {/* Resume Builder Card */}
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4">Resume Builder</h2>
                <p className="text-blue-100 mb-4">
                  Create professional resumes tailored to specific job applications.
                </p>
                <Link
                  href="/resume/new"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Create Resume
                </Link>
              </div>

              {/* Applications Card */}
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <h2 className="text-xl font-semibold text-white mb-4">Applications</h2>
                <p className="text-blue-100 mb-4">
                  Track your job applications and generated documents.
                </p>
                <Link
                  href="/applications"
                  className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  View Applications
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Recent Activity</h2>
              <div className="bg-white/10 rounded-xl p-6 border border-white/20">
                <p className="text-blue-100 text-center py-8">
                  No recent activity. Start by completing your profile or creating your first resume!
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}