'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ArrowRight, User, Mail, Phone, MapPin, Briefcase, GraduationCap } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Timestamp } from 'firebase/firestore';

export default function ProfileSetupPage() {
  const { user, updateUserProfile, loading } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [profileData, setProfileData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    location: '',
    
    // Professional Summary
    title: '',
    summary: '',
    
    // Basic Experience
    currentRole: '',
    experience: '',
    
    // Skills
    skills: [] as string[],
    skillInput: ''
  });

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (stepNumber === 1) {
      if (!profileData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!profileData.lastName.trim()) newErrors.lastName = 'Last name is required';
      // Email is pre-filled from user auth and disabled, so no validation needed
      if (!profileData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!profileData.location.trim()) newErrors.location = 'Location is required';
    }
    
    if (stepNumber === 2) {
      if (!profileData.title.trim()) newErrors.title = 'Professional title is required';
      if (!profileData.summary.trim()) newErrors.summary = 'Professional summary is required';
    }
    
    if (stepNumber === 3) {
      if (!profileData.currentRole.trim()) newErrors.currentRole = 'Current role is required';
      if (!profileData.experience.trim()) newErrors.experience = 'Experience level is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const addSkill = () => {
    if (profileData.skillInput.trim() && !profileData.skills.includes(profileData.skillInput.trim())) {
      setProfileData({
        ...profileData,
        skills: [...profileData.skills, profileData.skillInput.trim()],
        skillInput: ''
      });
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setProfileData({
      ...profileData,
      skills: profileData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;
    
    setIsSubmitting(true);
    try {
      const userProfile = {
        personalInfo: {
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          phone: profileData.phone || '',
          location: {
            city: profileData.location,
            country: ''
          },
          linkedinUrl: '',
          portfolioUrl: ''
        },
        summary: {
          headline: profileData.title,
          description: profileData.summary
        },
        experience: [{
          id: '1',
          company: 'Current Company',
          position: profileData.currentRole,
          startDate: '',
          endDate: '',
          description: '',
          achievements: []
        }],
        education: [],
        skills: {
          technical: profileData.skills.map((skill: string) => ({
            name: skill,
            level: 'Intermediate' as const,
            yearsOfExperience: 1
          })),
          soft: [],
          languages: []
        },
        metadata: {
          completionPercentage: 0,
          lastUpdated: Timestamp.now(),
          version: 1
        }
      };
      
      await updateUserProfile(userProfile);
      router.push('/dashboard');
    } catch (error) {
      console.error('Profile setup failed:', error);
      setErrors({ submit: 'Failed to create profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <LoadingSpinner size="lg" color="white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: "radial-gradient(circle at 30px 30px, rgba(255,255,255,0.1) 2px, transparent 2px)", backgroundSize: "60px 60px"}} />
      </div>
      
      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <img 
              src="/logo.svg" 
              alt="CraftlyCV Logo" 
              className="h-12 w-auto filter brightness-0 invert drop-shadow-lg"
            />
          </div>
          <h1 className="text-3xl font-bold text-white font-poppins mb-2">
            Complete Your Profile
          </h1>
          <p className="text-blue-200">
            Let's set up your professional profile to get started
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-blue-200">Step {step} of 4</span>
            <span className="text-sm text-blue-200">{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Personal Information</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="John"
                  />
                  {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Email</label>
                <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent opacity-75"
                    placeholder={user?.email || 'Loading email...'}
                    disabled
                    readOnly
                  />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Location</label>
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="New York, NY"
                />
                {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Professional Summary */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Professional Summary</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Professional Title</label>
                <input
                  type="text"
                  value={profileData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Software Engineer"
                />
                {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Professional Summary</label>
                <textarea
                  value={profileData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Brief description of your professional background and key achievements..."
                />
                {errors.summary && <p className="text-red-400 text-sm mt-1">{errors.summary}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Experience */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Experience</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Current Role</label>
                <input
                  type="text"
                  value={profileData.currentRole}
                  onChange={(e) => handleInputChange('currentRole', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Senior Software Engineer"
                />
                {errors.currentRole && <p className="text-red-400 text-sm mt-1">{errors.currentRole}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Years of Experience</label>
                <select
                  value={profileData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="" className="bg-slate-800">Select experience level</option>
                  <option value="0-1" className="bg-slate-800">0-1 years</option>
                  <option value="2-3" className="bg-slate-800">2-3 years</option>
                  <option value="4-5" className="bg-slate-800">4-5 years</option>
                  <option value="6-10" className="bg-slate-800">6-10 years</option>
                  <option value="10+" className="bg-slate-800">10+ years</option>
                </select>
                {errors.experience && <p className="text-red-400 text-sm mt-1">{errors.experience}</p>}
              </div>
            </div>
          )}

          {/* Step 4: Skills */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-white">Skills</h2>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-2">Add Skills</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={profileData.skillInput}
                    onChange={(e) => setProfileData({ ...profileData, skillInput: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {profileData.skills.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">Your Skills</label>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-200 px-3 py-1 rounded-full text-sm border border-blue-500/30"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-blue-300 hover:text-white"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-3 text-white/70 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Back
            </button>
            
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? (
                  <LoadingSpinner size="sm" color="white" />
                ) : (
                  'Complete Setup'
                )}
              </button>
            )}
          </div>
          
          {errors.submit && (
            <p className="text-red-400 text-sm mt-4 text-center">{errors.submit}</p>
          )}
        </div>
      </div>
    </div>
  );
}