'use client';

import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useToast, useAutoSaveToast } from '@/contexts/ToastContext';
import { useAutoSave } from '@/hooks/useAutoSave';
import { useOptimisticProfileUpdate } from '@/hooks/useOptimisticUpdate';
import { InlineEditField } from '@/components/ui/InlineEditField';
import { validatePersonalInfo, validateWorkExperience, validateEducation, validateSummary } from '@/utils/validation';
import { UserProfile } from '@/types';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { User, MapPin, Phone, Mail, Globe, Briefcase, GraduationCap, Award, Languages, LogOut, Edit3, Save, Plus, Trash2, ExternalLink, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, userProfile, updateUserProfile, signOut, loading } = useAuth();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { showSaving, showSaved, showSaveError } = useAutoSaveToast();
  const [activeTab, setActiveTab] = useState('personal');
  
  // Optimistic updates
  const { data: optimisticProfile, isUpdating, updateOptimistically } = useOptimisticProfileUpdate(
    userProfile || {
      id: '',
      personalInfo: { firstName: '', lastName: '', email: '', phone: '', location: { city: '', country: '' }, linkedinUrl: '', portfolioUrl: '' },
      summary: { headline: '', description: '' },
      experience: [],
      education: [],
      skills: { technical: [], soft: [], languages: [] },
      metadata: { completionPercentage: 0, lastUpdated: new Date() as any, version: 1 }
    },
    updateUserProfile
  );
  
  // Auto-save functionality
  const { saveData, isSaving, lastSaved, error: saveError } = useAutoSave({
    onSave: updateUserProfile,
    delay: 2000 // 2 second debounce
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed:', error);
      showError('Sign out failed', 'Please try again');
    }
  };

  const handleProfileUpdate = useCallback(async (field: string, value: any) => {
    if (!optimisticProfile) return;
    
    // Convert dot notation to nested object
    const createNestedUpdate = (path: string, val: any) => {
      const keys = path.split('.');
      const result: any = {};
      let current = result;
      
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key) {
          current[key] = {};
          current = current[key];
        }
      }
      
      const lastKey = keys[keys.length - 1];
      if (lastKey) {
        current[lastKey] = val;
      }
      return result;
    };
    
    // Deep merge the updates with the current profile
    const deepMerge = (target: any, source: any): any => {
      const result = { ...target };
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
      return result;
    };
    
    const updates = createNestedUpdate(field, value);
    const mergedProfile = deepMerge(optimisticProfile, updates);
    
    // Show saving toast
    const toastId = showSaving();
    
    try {
      // Apply optimistic update immediately
      await updateOptimistically(mergedProfile);
      
      // Show success
      showSaved(toastId);
    } catch (error) {
      console.error('Error updating profile:', error);
      showSaveError(error instanceof Error ? error.message : 'Failed to save changes', toastId);
    }
  }, [optimisticProfile, updateOptimistically, showSaving, showSaved, showSaveError]);

  const handleArrayUpdate = useCallback(async (field: string, index: number, updates: any) => {
    if (!optimisticProfile) return;
    
    // Handle nested field paths like 'skills.technical'
    const fieldParts = field.split('.');
    let currentArray: any[] = [];
    
    if (fieldParts.length === 1 && fieldParts[0]) {
      currentArray = (optimisticProfile as any)[fieldParts[0]] || [];
    } else if (fieldParts.length === 2) {
      const [parent, child] = fieldParts;
      if (parent && child) {
        currentArray = ((optimisticProfile as any)[parent]?.[child]) || [];
      }
    }
    
    if (index < 0 || index >= currentArray.length) return;
    
    const newArray = [...currentArray];
    newArray[index] = { ...newArray[index], ...updates };
    
    await handleProfileUpdate(field, newArray);
  }, [optimisticProfile, handleProfileUpdate]);

  const handleArrayAdd = useCallback(async (field: string, newItem: any) => {
    if (!optimisticProfile) return;
    
    // Handle nested field paths like 'skills.technical'
    const fieldParts = field.split('.');
    let currentArray: any[] = [];
    
    if (fieldParts.length === 1 && fieldParts[0]) {
      currentArray = (optimisticProfile as any)[fieldParts[0]] || [];
    } else if (fieldParts.length === 2) {
      const [parent, child] = fieldParts;
      if (parent && child) {
        currentArray = ((optimisticProfile as any)[parent]?.[child]) || [];
      }
    }
    
    const itemWithId = typeof newItem === 'object' && newItem !== null 
      ? { ...newItem, id: Date.now().toString() }
      : newItem;
    
    const newArray = [...currentArray, itemWithId];
    
    await handleProfileUpdate(field, newArray);
    showSuccess('Added successfully', `New ${field.split('.').pop()?.slice(0, -1) || 'item'} added to your profile`);
  }, [optimisticProfile, handleProfileUpdate, showSuccess]);

  const handleArrayRemove = useCallback(async (field: string, index: number) => {
    if (!optimisticProfile) return;
    
    // Handle nested field paths like 'skills.technical'
    const fieldParts = field.split('.');
    let currentArray: any[] = [];
    
    if (fieldParts.length === 1 && fieldParts[0]) {
      currentArray = (optimisticProfile as any)[fieldParts[0]] || [];
    } else if (fieldParts.length === 2) {
      const [parent, child] = fieldParts;
      if (parent && child) {
        currentArray = ((optimisticProfile as any)[parent]?.[child]) || [];
      }
    }
    
    if (index < 0 || index >= currentArray.length) return;
    
    const newArray = currentArray.filter((_: any, i: number) => i !== index);
    
    await handleProfileUpdate(field, newArray);
    showSuccess('Removed successfully', `${field.split('.').pop()?.slice(0, -1) || 'item'} removed from your profile`);
  }, [optimisticProfile, handleProfileUpdate, showSuccess]);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'skills', label: 'Skills', icon: Award },
  ];

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">First Name</label>
            <InlineEditField
              value={optimisticProfile?.personalInfo?.firstName || ''}
              onSave={(value) => handleProfileUpdate('personalInfo.firstName', value)}
              placeholder="Enter your first name"
              validate={validatePersonalInfo.firstName}
              className="text-white bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Last Name</label>
            <InlineEditField
              value={optimisticProfile?.personalInfo?.lastName || ''}
              onSave={(value) => handleProfileUpdate('personalInfo.lastName', value)}
              placeholder="Enter your last name"
              validate={validatePersonalInfo.lastName}
              className="text-white bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Email</label>
            <InlineEditField
              value={optimisticProfile?.personalInfo?.email || user?.email || ''}
              onSave={(value) => handleProfileUpdate('personalInfo.email', value)}
              placeholder="Enter your email"
              validate={validatePersonalInfo.email}
              className="text-white bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Phone</label>
            <InlineEditField
              value={optimisticProfile?.personalInfo?.phone || ''}
              onSave={(value) => handleProfileUpdate('personalInfo.phone', value)}
              placeholder="Enter your phone number"
              validate={validatePersonalInfo.phone}
              className="text-white bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Location
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">City</label>
            <InlineEditField
              value={optimisticProfile?.personalInfo?.location?.city || ''}
              onSave={(value) => handleProfileUpdate('personalInfo.location.city', value)}
              placeholder="Enter your city"
              className="text-white bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Country</label>
            <InlineEditField
              value={optimisticProfile?.personalInfo?.location?.country || ''}
              onSave={(value) => handleProfileUpdate('personalInfo.location.country', value)}
              placeholder="Enter your country"
              className="text-white bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Professional Summary</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Headline</label>
            <InlineEditField
              value={optimisticProfile?.summary?.headline || ''}
              onSave={(value) => handleProfileUpdate('summary.headline', value)}
              placeholder="Enter a professional headline"
              validate={validateSummary.headline}
              className="text-white bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Description</label>
            <InlineEditField
              value={optimisticProfile?.summary?.description || ''}
              onSave={(value) => handleProfileUpdate('summary.description', value)}
              placeholder="Write a brief professional summary..."
              multiline
              validate={validateSummary.description}
              className="text-blue-100 bg-transparent leading-relaxed"
              maxLength={500}
            />
          </div>
        </div>
      </div>

      {/* Contact & Links */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Links & Social Media
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">LinkedIn URL</label>
            <InlineEditField
              value={optimisticProfile?.personalInfo?.linkedinUrl || ''}
              onSave={(value) => handleProfileUpdate('personalInfo.linkedinUrl', value)}
              placeholder="https://linkedin.com/in/username"
              validate={validatePersonalInfo.linkedinUrl}
              className="text-white bg-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-blue-100 mb-1">Portfolio URL</label>
            <InlineEditField
              value={optimisticProfile?.personalInfo?.portfolioUrl || ''}
              onSave={(value) => handleProfileUpdate('personalInfo.portfolioUrl', value)}
              placeholder="https://yourportfolio.com"
              validate={validatePersonalInfo.portfolioUrl}
              className="text-white bg-transparent"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderExperience = () => (
    <div className="space-y-6">
      {optimisticProfile?.experience && optimisticProfile.experience.length > 0 ? (
        optimisticProfile.experience.map((exp, index) => (
          <div key={exp.id || index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">Job Title</label>
                    <InlineEditField
                      value={exp.position || ''}
                      onSave={(value) => handleArrayUpdate('experience', index, { position: value })}
                      placeholder="Enter job title"
                      validate={validateWorkExperience.position}
                      className="text-white bg-transparent font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">Company</label>
                    <InlineEditField
                      value={exp.company || ''}
                      onSave={(value) => handleArrayUpdate('experience', index, { company: value })}
                      placeholder="Enter company name"
                      validate={validateWorkExperience.company}
                      className="text-blue-300 bg-transparent font-medium"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">Start Date</label>
                    <InlineEditField
                      value={exp.startDate || ''}
                      onSave={(value) => handleArrayUpdate('experience', index, { startDate: value })}
                      placeholder="MM/YYYY"
                      validate={validateWorkExperience.startDate}
                      className="text-blue-100 bg-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">End Date</label>
                    <InlineEditField
                      value={exp.endDate || ''}
                      onSave={(value) => handleArrayUpdate('experience', index, { endDate: value })}
                      placeholder="MM/YYYY or Present"
                      className="text-blue-100 bg-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">Location</label>
                    <InlineEditField
                      value={exp.location || ''}
                      onSave={(value) => handleArrayUpdate('experience', index, { location: value })}
                      placeholder="City, Country"
                      className="text-blue-100 bg-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Briefcase className="w-6 h-6 text-blue-300" />
                <button
                  onClick={() => handleArrayRemove('experience', index)}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  title="Remove experience"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-1">Description</label>
                <InlineEditField
                  value={exp.description || ''}
                  onSave={(value) => handleArrayUpdate('experience', index, { description: value })}
                  placeholder="Describe your role and responsibilities..."
                  multiline
                  validate={validateWorkExperience.description}
                  className="text-blue-100 bg-transparent leading-relaxed"
                  maxLength={1000}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
          <Briefcase className="w-12 h-12 text-blue-100 mx-auto mb-4" />
          <p className="text-blue-100">No work experience added yet.</p>
          <p className="text-blue-200 text-sm mt-2">Add your professional experience to showcase your career journey.</p>
        </div>
      )}
      
      {/* Add New Experience Button */}
      <button
        onClick={() => handleArrayAdd('experience', {
          position: '',
          company: '',
          startDate: '',
          endDate: '',
          location: '',
          description: '',
          achievements: []
        })}
        className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-xl p-4 text-blue-300 font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Work Experience
      </button>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      {optimisticProfile?.education && optimisticProfile.education.length > 0 ? (
        optimisticProfile.education.map((edu, index) => (
          <div key={edu.id || index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">Degree</label>
                    <InlineEditField
                      value={edu.degree || ''}
                      onSave={(value) => handleArrayUpdate('education', index, { degree: value })}
                      placeholder="Enter degree/qualification"
                      validate={validateEducation.degree}
                      className="text-white bg-transparent font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">Institution</label>
                    <InlineEditField
                      value={edu.institution || ''}
                      onSave={(value) => handleArrayUpdate('education', index, { institution: value })}
                      placeholder="Enter institution name"
                      validate={validateEducation.institution}
                      className="text-blue-300 bg-transparent font-medium"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">Start Date</label>
                    <InlineEditField
                      value={edu.startDate || ''}
                      onSave={(value) => handleArrayUpdate('education', index, { startDate: value })}
                      placeholder="MM/YYYY"
                      validate={validateEducation.startDate}
                      className="text-blue-100 bg-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">End Date</label>
                    <InlineEditField
                      value={edu.endDate || ''}
                      onSave={(value) => handleArrayUpdate('education', index, { endDate: value })}
                      placeholder="MM/YYYY or Present"
                      className="text-blue-100 bg-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">GPA (Optional)</label>
                    <InlineEditField
                      value={edu.gpa?.toString() || ''}
                      onSave={(value) => handleArrayUpdate('education', index, { gpa: value ? parseFloat(value) : undefined })}
                      placeholder="3.8"
                      validate={validateEducation.gpa}
                      className="text-blue-100 bg-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-blue-100 mb-1">Location</label>
                    <InlineEditField
                      value={edu.location || ''}
                      onSave={(value) => handleArrayUpdate('education', index, { location: value })}
                      placeholder="City, Country"
                      className="text-blue-100 bg-transparent text-sm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <GraduationCap className="w-6 h-6 text-blue-300" />
                <button
                  onClick={() => handleArrayRemove('education', index)}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  title="Remove education"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-100 mb-1">Achievements (Optional)</label>
                <InlineEditField
                  value={edu.achievements?.join(', ') || ''}
                  onSave={(value) => handleArrayUpdate('education', index, { achievements: value ? value.split(', ').filter(Boolean) : [] })}
                  placeholder="Describe relevant coursework, projects, or achievements..."
                  multiline
                  className="text-blue-100 bg-transparent leading-relaxed"
                  maxLength={500}
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
          <GraduationCap className="w-12 h-12 text-blue-100 mx-auto mb-4" />
          <p className="text-blue-100">No education added yet.</p>
          <p className="text-blue-200 text-sm mt-2">Add your educational background to complete your profile.</p>
        </div>
      )}
      
      {/* Add New Education Button */}
      <button
        onClick={() => handleArrayAdd('education', {
          degree: '',
          institution: '',
          startDate: '',
          endDate: '',
          location: '',
          gpa: '',
          description: ''
        })}
        className="w-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/50 rounded-xl p-4 text-blue-300 font-medium transition-colors flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Add Education
      </button>
    </div>
  );

  const renderSkills = () => (
    <div className="space-y-6">
      {/* Technical Skills */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Award className="w-5 h-5" />
            Technical Skills
          </h3>
          <button
            onClick={() => handleArrayAdd('skills.technical', {
              name: '',
              level: 'Intermediate'
            })}
            className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
            title="Add technical skill"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {optimisticProfile?.skills?.technical && optimisticProfile.skills.technical.length > 0 ? (
          <div className="space-y-3">
            {optimisticProfile.skills.technical.map((skill, index) => (
              <div key={`tech-${index}`} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InlineEditField
                    value={skill.name || ''}
                    onSave={(value) => handleArrayUpdate('skills.technical', index, { name: value })}
                    placeholder="Enter skill name"
                    className="text-blue-300 bg-transparent font-medium"
                  />
                  <select
                    value={skill.level || 'Intermediate'}
                    onChange={(e) => handleArrayUpdate('skills.technical', index, { level: e.target.value })}
                    className="bg-transparent text-blue-100 text-sm border border-white/20 rounded px-2 py-1"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <button
                  onClick={() => handleArrayRemove('skills.technical', index)}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  title="Remove skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-blue-100 text-sm">No technical skills added yet. Click + to add your first skill.</p>
        )}
      </div>

      {/* Soft Skills */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Soft Skills</h3>
          <button
            onClick={() => handleArrayAdd('skills.soft', {
              name: '',
              level: 'Intermediate'
            })}
            className="p-2 text-purple-400 hover:text-purple-300 transition-colors"
            title="Add soft skill"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {optimisticProfile?.skills?.soft && optimisticProfile.skills.soft.length > 0 ? (
          <div className="space-y-2">
            {optimisticProfile.skills.soft.map((skill, index) => (
              <div key={`soft-${index}`} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <InlineEditField
                    value={skill.name || ''}
                    onSave={(value) => handleArrayUpdate('skills.soft', index, { name: value })}
                    placeholder="Enter soft skill"
                    className="text-purple-300 bg-transparent font-medium"
                  />
                  <select
                    value={skill.level || 'Intermediate'}
                    onChange={(e) => handleArrayUpdate('skills.soft', index, { level: e.target.value })}
                    className="bg-transparent text-blue-100 text-sm border border-white/20 rounded px-2 py-1"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
                <button
                  onClick={() => handleArrayRemove('skills.soft', index)}
                  className="p-1 text-red-400 hover:text-red-300 transition-colors"
                  title="Remove skill"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-blue-100 text-sm">No soft skills added yet. Click + to add your first skill.</p>
        )}
      </div>

      {/* Languages */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Languages className="w-5 h-5" />
            Languages
          </h3>
          <button
             onClick={() => handleArrayAdd('skills.languages', {
               name: '',
               proficiency: 'Conversational'
             })}
             className="p-2 text-green-400 hover:text-green-300 transition-colors"
             title="Add language"
           >
             <Plus className="w-4 h-4" />
           </button>
         </div>
         {optimisticProfile?.skills?.languages && optimisticProfile.skills.languages.length > 0 ? (
           <div className="space-y-3">
             {optimisticProfile.skills.languages.map((lang, index) => (
               <div key={`lang-${index}`} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                 <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                   <InlineEditField
                     value={lang.name || ''}
                     onSave={(value) => handleArrayUpdate('skills.languages', index, { name: value })}
                     placeholder="Enter language"
                     className="text-green-300 bg-transparent font-medium"
                   />
                   <select
                     value={lang.proficiency || 'Conversational'}
                     onChange={(e) => handleArrayUpdate('skills.languages', index, { proficiency: e.target.value })}
                     className="bg-transparent text-blue-100 text-sm border border-white/20 rounded px-2 py-1"
                   >
                     <option value="Basic">Basic</option>
                     <option value="Conversational">Conversational</option>
                     <option value="Fluent">Fluent</option>
                     <option value="Native">Native</option>
                   </select>
                 </div>
                 <button
                   onClick={() => handleArrayRemove('skills.languages', index)}
                   className="p-1 text-red-400 hover:text-red-300 transition-colors"
                   title="Remove language"
                 >
                   <Trash2 className="w-4 h-4" />
                 </button>
               </div>
             ))}
           </div>
         ) : (
           <p className="text-blue-100 text-sm">No languages added yet. Click + to add your first language.</p>
         )}
      </div>
    </div>
  );

  // Show loading state while userProfile is being fetched
  if (loading || !userProfile) {
    return (
      <ProtectedRoute requireProfile={false}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading your profile...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireProfile={false}>
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
              <Link href="/dashboard" className="flex items-center">
                <Image
                  src="/logo.svg"
                  alt="CraftlyCV"
                  width={120}
                  height={40}
                  className="h-10 w-auto filter brightness-0 invert"
                />
              </Link>

              {/* Navigation */}
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="text-blue-100 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <div className="text-white">
                  <p className="text-sm font-medium">
                    {userProfile?.personalInfo.firstName || user?.displayName || user?.email}
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
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-blue-100">
                  View and manage your professional profile information
                </p>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="mb-8">
              <div className="flex justify-between text-sm text-blue-100 mb-2">
                <span>Profile Completion</span>
                <span>{userProfile?.metadata.completionPercentage || 0}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${userProfile?.metadata.completionPercentage || 0}%` }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex space-x-1 mb-8 bg-white/5 rounded-lg p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-100 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'personal' && renderPersonalInfo()}
              {activeTab === 'experience' && renderExperience()}
              {activeTab === 'education' && renderEducation()}
              {activeTab === 'skills' && renderSkills()}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}