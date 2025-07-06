'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle, Zap, Target, FileText, Download } from 'lucide-react';

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function HomePage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  const handleGetStarted = async () => {
    if (user) {
      router.push('/dashboard');
    } else {
      try {
        await signInWithGoogle();
        router.push('/dashboard');
      } catch (error) {
        console.error('Sign in failed:', error);
      }
    }
  };

  return (
    <main id="main-content" className="min-h-screen">
      {/* Navigation Header */}
      <nav className="absolute top-0 left-0 right-0 z-50 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/logo.svg" 
                alt="CraftlyCV Logo" 
                className="h-10 w-auto filter brightness-0 invert drop-shadow-lg"
              />
              <span className="ml-3 text-xl font-bold text-white font-poppins">CraftlyCV</span>
            </div>
            
            {/* Navigation Links */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-white/80 text-sm">Welcome, {user.displayName || user.email}</span>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    Dashboard
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push('/login')}
                    className="text-white hover:text-blue-200 px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => router.push('/signup')}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-sm font-medium transition-colors backdrop-blur-sm border border-white/20"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 min-h-screen flex items-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: "radial-gradient(circle at 30px 30px, rgba(255,255,255,0.1) 2px, transparent 2px)", backgroundSize: "60px 60px"}} />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-32 right-16 w-32 h-32 bg-purple-400/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-500" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="max-w-5xl mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img 
                src="/logo.svg" 
                alt="CraftlyCV Logo" 
                className="h-20 w-auto filter brightness-0 invert drop-shadow-2xl"
              />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-poppins mb-6 tracking-tight bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
              Craft Your Perfect CV
            </h1>
            
            {/* Subheading */}
            <p className="text-lg md:text-xl lg:text-2xl mb-4 text-blue-100 leading-relaxed max-w-4xl mx-auto font-medium">
              AI-powered resume and cover letter builder that gets you hired
            </p>
            
            <p className="text-base md:text-lg mb-10 text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Create professional, ATS-optimized applications tailored for each job. 
              Join thousands who landed their dream jobs with our intelligent platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <button
                onClick={handleGetStarted}
                disabled={loading}
                className="group relative bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-4 rounded-full text-lg font-semibold flex items-center gap-3 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? (
                  <div className="loading-spinner border-white" />
                ) : (
                  <>
                    {user ? 'Go to Dashboard' : 'Start Building Free'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <button className="group border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 backdrop-blur-sm hover:backdrop-blur-none flex items-center gap-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">100% Free to Start</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">ATS-Optimized</span>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5">
          <div className="absolute top-20 left-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-purple-500 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4" />
              <span>How It Works</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold font-poppins text-slate-900 mb-6">
              Three Simple Steps to Success
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Transform your job search with our intelligent platform that creates personalized applications in minutes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {/* Step 1 */}
            <div className="relative group">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                    <FileText className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    1
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-poppins text-slate-900 mb-4">
                  Build Your Profile
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Create your comprehensive professional profile once with your experience, skills, and achievements. Our smart forms make it quick and easy.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    2
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-poppins text-slate-900 mb-4">
                  Add Job Details
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Simply paste the job description or provide job details. Our AI analyzes requirements and intelligently matches your profile.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110">
                    <Download className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    3
                  </div>
                </div>
                <h3 className="text-2xl font-bold font-poppins text-slate-900 mb-4">
                  Generate & Download
                </h3>
                <p className="text-slate-600 leading-relaxed text-lg">
                  Get perfectly tailored resume and cover letter in seconds. Download as professional PDF and apply with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: "radial-gradient(circle at 30px 30px, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px"}} />
        </div>
        <div className="absolute top-20 right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-60 h-60 bg-purple-400/20 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Why Choose Us</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-bold font-poppins text-white mb-8">
                Built for Modern Job Seekers
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">ATS-Optimized Content</h3>
                    <p className="text-blue-100 leading-relaxed text-lg">Every resume is optimized to pass Applicant Tracking Systems and reach human recruiters with the right keywords and formatting.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">AI-Powered Personalization</h3>
                    <p className="text-blue-100 leading-relaxed text-lg">Our advanced AI analyzes job requirements and highlights your most relevant experience and skills for each application.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Professional Templates</h3>
                    <p className="text-blue-100 leading-relaxed text-lg">Choose from modern, recruiter-approved templates designed to make you stand out in today's competitive job market.</p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Application Tracking</h3>
                    <p className="text-blue-100 leading-relaxed text-lg">Keep track of all your applications, interviews, and follow-ups in one organized dashboard.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 border border-white/20 shadow-2xl">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Download className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-bold font-poppins text-white mb-6">
                  Ready to Transform Your Job Search?
                </h3>
                <p className="text-blue-100 mb-8 text-lg leading-relaxed">
                  Join thousands of successful job seekers who have landed their dream positions using our AI-powered platform.
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">10K+</div>
                    <div className="text-blue-200 text-sm">Resumes Created</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-2">95%</div>
                    <div className="text-blue-200 text-sm">Success Rate</div>
                  </div>
                </div>
                
                <button
                  onClick={handleGetStarted}
                  disabled={loading}
                  className="group w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-4 px-8 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <div className="loading-spinner border-white" />
                  ) : (
                    <>
                      {user ? 'Go to Dashboard' : 'Start Building Free'}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img 
                src="/logo.svg" 
                alt="CraftlyCV Logo" 
                className="h-12 w-auto filter brightness-0 invert"
              />
            </div>
            
            <p className="text-slate-300 mb-8 text-lg max-w-2xl mx-auto">
              Empowering job seekers worldwide with AI-powered resume and cover letter generation. 
              Your dream job is just one click away.
            </p>
            
            {/* Social Links */}
            <div className="flex justify-center space-x-6 mb-8">
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z"/>
                </svg>
              </a>
            </div>
            
            {/* Navigation Links */}
            <div className="flex flex-wrap justify-center gap-8 text-slate-400 mb-8">
              <a href="#" className="hover:text-white transition-colors duration-300 font-medium">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors duration-300 font-medium">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors duration-300 font-medium">Contact Us</a>
              <a href="#" className="hover:text-white transition-colors duration-300 font-medium">Help Center</a>
              <a href="#" className="hover:text-white transition-colors duration-300 font-medium">Blog</a>
            </div>
            
            {/* Copyright */}
            <div className="pt-8 border-t border-slate-800 text-slate-400">
              <p>© 2024 CraftlyCV. All rights reserved. Made with ❤️ for job seekers worldwide.</p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}