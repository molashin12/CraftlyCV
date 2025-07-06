import { UserProfile } from '@/types';

/**
 * Calculate profile completion percentage based on filled fields
 */
export const calculateCompletionPercentage = (profile: UserProfile): number => {
  if (!profile) return 0;

  let totalFields = 0;
  let filledFields = 0;

  // Personal Info (weight: 30%)
  const personalInfoFields = [
    profile.personalInfo?.firstName,
    profile.personalInfo?.lastName,
    profile.personalInfo?.email,
    profile.personalInfo?.phone,
    profile.personalInfo?.location?.city,
    profile.personalInfo?.location?.country
  ];
  
  totalFields += personalInfoFields.length;
  filledFields += personalInfoFields.filter(field => field && field.trim() !== '').length;

  // Professional Summary (weight: 20%)
  const summaryFields = [
    profile.summary?.headline,
    profile.summary?.description
  ];
  
  totalFields += summaryFields.length;
  filledFields += summaryFields.filter(field => field && field.trim() !== '').length;

  // Contact & Links (weight: 10%)
  const contactFields = [
    profile.personalInfo?.linkedinUrl,
    profile.personalInfo?.portfolioUrl
  ];
  
  totalFields += contactFields.length;
  filledFields += contactFields.filter(field => field && field.trim() !== '').length;

  // Experience (weight: 20%)
  if (profile.experience && profile.experience.length > 0) {
    const experienceFields = profile.experience.flatMap(exp => [
      exp.company,
      exp.position,
      exp.startDate,
      exp.description
    ]);
    
    totalFields += Math.min(experienceFields.length, 8); // Cap at 2 experiences
    filledFields += experienceFields.filter(field => field && field.trim() !== '').length;
  } else {
    totalFields += 4; // Minimum expected fields for one experience
  }

  // Education (weight: 10%)
  if (profile.education && profile.education.length > 0) {
    const educationFields = profile.education.flatMap(edu => [
      edu.institution,
      edu.degree,
      edu.startDate
    ]);
    
    totalFields += Math.min(educationFields.length, 6); // Cap at 2 educations
    filledFields += educationFields.filter(field => field && field.trim() !== '').length;
  } else {
    totalFields += 3; // Minimum expected fields for one education
  }

  // Skills (weight: 10%)
  const skillsCount = (
    (profile.skills?.technical?.length || 0) +
    (profile.skills?.soft?.length || 0) +
    (profile.skills?.languages?.length || 0)
  );
  
  totalFields += 5; // Expect at least 5 skills total
  filledFields += Math.min(skillsCount, 5);

  // Calculate percentage
  const percentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  
  // Ensure percentage is between 0 and 100
  return Math.min(Math.max(percentage, 0), 100);
};