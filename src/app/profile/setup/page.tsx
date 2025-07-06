'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { UserProfile } from '@/types/user';
import { PersonalInfoForm } from '@/components/profile/PersonalInfoForm';
import { EducationForm } from '@/components/profile/EducationForm';
import { ExperienceForm } from '@/components/profile/ExperienceForm';
import { SkillsForm } from '@/components/profile/SkillsForm';
import { ProjectsForm } from '@/components/profile/ProjectsForm';
import { CertificationsForm } from '@/components/profile/CertificationsForm';
import { LanguagesForm } from '@/components/profile/LanguagesForm';
import { calculateProfileCompletion } from '@/utils/profileUtils';
import { useOptimisticProfileUpdate } from '@/hooks/useOptimisticProfileUpdate';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useAutoSaveToast } from '@/contexts/ToastContext';

const STEPS = [
  { id: 'personal', title: 'Personal Info', component: PersonalInfoForm },
  { id: 'education', title: 'Education', component: EducationForm },
  { id: 'experience', title: 'Experience', component: ExperienceForm },
  { id: 'skills', title: 'Skills', component: SkillsForm },
  { id: 'projects', title: 'Projects', component: ProjectsForm },
  { id: 'certifications', title: 'Certifications', component: CertificationsForm },
  { id: 'languages', title: 'Languages', component: LanguagesForm },
];

const ProfileSetupPage: React.FC = () => {
  const { user, userProfile, saveUserProfile, fetchUserProfile } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { showSaving, showSaved, showSaveError } = useAutoSaveToast();
  
  const {
    optimisticProfile,
    updateOptimisticProfile,
    resetOptimisticProfile
  } = useOptimisticProfileUpdate(userProfile);

  const { saveWithAutoSave } = useAutoSave({
    onSave: async (data: UserProfile) => {
      if (user) {
        await saveUserProfile(user.uid, data);
      }
    },
    delay: 2000
  });

  useEffect(() => {
    const initializeProfile = async () => {
      if (user) {
        try {
          await fetchUserProfile(user.uid);
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    initializeProfile();
  }, [user, fetchUserProfile]);

  const deepMerge = (target: any, source: any): any => {
    if (source === null || source === undefined) return target;
    if (target === null || target === undefined) return source;
    
    if (Array.isArray(source)) {
      return source;
    }
    
    if (typeof source === 'object' && typeof target === 'object') {
      const result = { ...target };
      for (const key in source) {
        if (source.hasOwnProperty(key)) {
          result[key] = deepMerge(target[key], source[key]);
        }
      }
      return result;
    }
    
    return source;
  };

  const handleFieldUpdate = useCallback((field: string, value: any) => {
    if (!optimisticProfile) return;
    
    const updatedProfile = deepMerge(optimisticProfile, { [field]: value });
    updateOptimisticProfile(updatedProfile);
    saveWithAutoSave(updatedProfile);
  }, [optimisticProfile, updateOptimisticProfile, saveWithAutoSave]);

  const handleProfileUpdate = useCallback(async (updates: Partial<UserProfile>) => {
    if (!optimisticProfile || !user) return;
    
    const toastId = showSaving();
    
    try {
      const updatedProfile = deepMerge(optimisticProfile, updates);
      updateOptimisticProfile(updatedProfile);
      
      await saveUserProfile(user.uid, updatedProfile);
      showSaved(toastId);
    } catch (error) {
      console.error('Error updating profile:', error);
      showSaveError(toastId);
      resetOptimisticProfile();
    }
  }, [optimisticProfile, user, updateOptimisticProfile, saveUserProfile, showSaving, showSaved, showSaveError, resetOptimisticProfile]);

  const handleArrayUpdate = useCallback(async (arrayField: keyof UserProfile, index: number, updates: any) => {
    if (!optimisticProfile || !user) return;
    
    const toastId = showSaving();
    
    try {
      const currentArray = optimisticProfile[arrayField] as any[] || [];
      const updatedArray = [...currentArray];
      updatedArray[index] = deepMerge(updatedArray[index] || {}, updates);
      
      const updatedProfile = deepMerge(optimisticProfile, { [arrayField]: updatedArray });
      updateOptimisticProfile(updatedProfile);
      
      await saveUserProfile(user.uid, updatedProfile);
      showSaved(toastId);
    } catch (error) {
      console.error('Error updating array:', error);
      showSaveError(toastId);
      resetOptimisticProfile();
    }
  }, [optimisticProfile, user, updateOptimisticProfile, saveUserProfile, showSaving, showSaved, showSaveError, resetOptimisticProfile]);

  const handleArrayAdd = useCallback(async (arrayField: keyof UserProfile, newItem: any) => {
    if (!optimisticProfile || !user) return;
    
    const toastId = showSaving();
    
    try {
      const currentArray = optimisticProfile[arrayField] as any[] || [];
      const updatedArray = [...currentArray, newItem];
      
      const updatedProfile = deepMerge(optimisticProfile, { [arrayField]: updatedArray });
      updateOptimisticProfile(updatedProfile);
      
      await saveUserProfile(user.uid, updatedProfile);
      showSaved(toastId);
    } catch (error) {
      console.error('Error adding to array:', error);
      showSaveError(toastId);
      resetOptimisticProfile();
    }
  }, [optimisticProfile, user, updateOptimisticProfile, saveUserProfile, showSaving, showSaved, showSaveError, resetOptimisticProfile]);

  const handleArrayRemove = useCallback(async (arrayField: keyof UserProfile, index: number) => {
    if (!optimisticProfile || !user) return;
    
    const toastId = showSaving();
    
    try {
      const currentArray = optimisticProfile[arrayField] as any[] || [];
      const updatedArray = currentArray.filter((_, i) => i !== index);
      
      const updatedProfile = deepMerge(optimisticProfile, { [arrayField]: updatedArray });
      updateOptimisticProfile(updatedProfile);
      
      await saveUserProfile(user.uid, updatedProfile);
      showSaved(toastId);
    } catch (error) {
      console.error('Error removing from array:', error);
      showSaveError(toastId);
      resetOptimisticProfile();
    }
  }, [optimisticProfile, user, updateOptimisticProfile, saveUserProfile, showSaving, showSaved, showSaveError, resetOptimisticProfile]);

  const handleCompleteSetup = async () => {
    if (!optimisticProfile || !user) return;
    
    setIsSaving(true);
    try {
      const updatedProfile = {
        ...optimisticProfile,
        isProfileComplete: true,
        profileCompletedAt: new Date()
      };
      
      await saveUserProfile(user.uid, updatedProfile);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error completing setup:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!optimisticProfile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Error loading profile</div>
      </div>
    );
  }

  const CurrentStepComponent = STEPS[currentStep].component;
  const completionPercentage = calculateProfileCompletion(optimisticProfile);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Profile Setup</h1>
              <p className="text-gray-400 mt-1">
                Step {currentStep + 1} of {STEPS.length}: {STEPS[currentStep].title}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Profile Completion</div>
              <div className="text-xl font-semibold text-blue-400">
                {completionPercentage}%
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center space-x-2">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex-1">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        index <= currentStep
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`flex-1 h-1 mx-2 ${
                          index < currentStep ? 'bg-blue-600' : 'bg-gray-700'
                        }`}
                      />
                    )}
                  </div>
                  <div className="mt-2 text-xs text-gray-400 text-center">
                    {step.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <CurrentStepComponent
            profile={optimisticProfile}
            onUpdate={handleFieldUpdate}
            onProfileUpdate={handleProfileUpdate}
            onArrayUpdate={handleArrayUpdate}
            onArrayAdd={handleArrayAdd}
            onArrayRemove={handleArrayRemove}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentStep === STEPS.length - 1 ? (
            <button
              onClick={handleCompleteSetup}
              disabled={isSaving}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? 'Completing...' : 'Complete Setup'}
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;