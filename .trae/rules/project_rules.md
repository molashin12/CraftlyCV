# 📋 CraftlyCV Development Rules & Guidelines

> **System Prompt for AI Assistant**: These rules ensure consistent adherence to project architecture, structure, and development standards for CraftlyCV.

---

## 🎯 Project Overview Adherence

### Core Mission
- **CraftlyCV** is an AI-powered job application assistant
- **Single Profile → Multiple Applications** paradigm
- **Firebase-first** serverless architecture
- **Next.js 14** with TypeScript and Tailwind CSS
- **Professional, human-like** AI-generated content

### Target Users
- Job seekers applying to multiple roles
- Students and fresh graduates
- Career switchers and professionals
- Users seeking ATS-optimized applications

---

## 🏗️ Architecture Rules

### Technology Stack Constraints
```typescript
// MANDATORY STACK - DO NOT DEVIATE
const TECH_STACK = {
  frontend: 'Next.js 14 + TypeScript + Tailwind CSS',
  backend: 'Firebase (Auth, Firestore, Functions, Hosting)',
  ai: 'Google Gemini Pro',
  pdf: 'Puppeteer',
  styling: 'Tailwind CSS with custom CraftlyCV theme',
  database: 'Firestore (NoSQL)',
  authentication: 'Firebase Auth (Google + LinkedIn)',
  hosting: 'Firebase Hosting'
};
```

### Forbidden Technologies
- ❌ **No SQL databases** (PostgreSQL, MySQL)
- ❌ **No traditional servers** (Express.js, Node.js servers)
- ❌ **No CSS frameworks** other than Tailwind
- ❌ **No state management libraries** (Redux, Zustand) - use React Context
- ❌ **No UI libraries** (Material-UI, Chakra) - build custom components

---

## 📁 File Structure Rules

### Mandatory Folder Structure
```
src/
├── app/                    # Next.js App Router ONLY
├── components/
│   ├── ui/                # Reusable UI components
│   ├── features/          # Feature-specific components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── common/            # Common components
├── hooks/                 # Custom React hooks
├── contexts/              # React contexts
├── lib/                   # Core libraries
├── services/              # API services
├── utils/                 # Utility functions
├── types/                 # TypeScript definitions
└── styles/                # CSS files
```

### File Naming Conventions
- **Components**: `PascalCase.tsx` (e.g., `ProfileBuilder.tsx`)
- **Hooks**: `use[Name].ts` (e.g., `useAuth.ts`)
- **Services**: `kebab-case.ts` (e.g., `ai-service.ts`)
- **Types**: `kebab-case.ts` (e.g., `user-profile.ts`)
- **Pages**: Always `page.tsx` (Next.js App Router)
- **Layouts**: Always `layout.tsx` (Next.js App Router)

### Import Rules
```typescript
// ALWAYS use absolute imports with @ prefix
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { UserProfile } from '@/types/profile';

// NEVER use relative imports for src/ files
// ❌ import { Button } from '../../../components/ui/Button';
```

---

## 🎨 Brand & Design Rules

### Color Palette (MANDATORY)
```css
:root {
  --primary-navy: #1C2B39;
  --pen-blue: #0D4D7A;
  --soft-bg: #F7F9FA;
  --dark-text: #1C1C1C;
  --success-green: #27AE60;
  --warning-red: #E74C3C;
}
```

### Typography Rules
- **Headings**: Poppins font family
- **Body text**: Inter font family
- **Brand name**: Always "CraftlyCV" (camelCase)
- **Tone**: Professional, friendly, encouraging

### UI Component Standards
```typescript
// Button styling template
const buttonClasses = "bg-primary-navy text-white px-8 py-3 rounded-2xl hover:bg-pen-blue transition-colors";

// Card styling template
const cardClasses = "bg-white shadow-md rounded-xl p-6";

// Input styling template
const inputClasses = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-pen-blue focus:outline-none";
```

---

## 🗄️ Data Model Rules

### Firestore Collection Structure (IMMUTABLE)
```typescript
// MANDATORY collection names - DO NOT CHANGE
const COLLECTIONS = {
  users: 'users',
  applications: 'applications', 
  templates: 'templates',
  analytics: 'analytics'
};
```

### User Profile Schema (STRICT)
```typescript
interface UserProfile {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location: { city: string; country: string; };
    linkedinUrl?: string;
    portfolioUrl?: string;
  };
  summary: {
    headline: string;
    description: string;
  };
  experience: WorkExperience[];
  education: Education[];
  skills: {
    technical: Skill[];
    soft: Skill[];
    languages: Language[];
  };
  metadata: {
    completionPercentage: number;
    lastUpdated: Timestamp;
    version: number;
  };
}
```

### Application Schema (STRICT)
```typescript
interface Application {
  id: string;
  userId: string;
  jobInfo: {
    title: string;
    company: string;
    description: string;
    requirements: string[];
  };
  generatedContent: {
    resume: { content: string; templateId: string; };
    coverLetter: { content: string; tone: string; };
  };
  matchAnalysis: {
    overallScore: number; // 0-100
    skillsMatch: { matched: string[]; missing: string[]; score: number; };
    improvements: { category: string; suggestion: string; impact: string; }[];
  };
  status: 'draft' | 'generated' | 'applied' | 'interview' | 'offer' | 'rejected';
  metadata: { createdAt: Timestamp; updatedAt: Timestamp; };
}
```

---

## 🔐 Security Rules

### Authentication Requirements
- **ALWAYS** validate user authentication in Firebase Functions
- **NEVER** trust client-side data without server validation
- **ALWAYS** use Firestore security rules

### Firestore Security Template
```javascript
// MANDATORY security rules pattern
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /applications/{applicationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
    }
  }
}
```

### API Security Checklist
- ✅ Validate user authentication
- ✅ Sanitize all inputs
- ✅ Rate limit AI API calls
- ✅ Validate data schemas
- ✅ Log security events

---

## 🤖 AI Integration Rules

### AI Service Standards
```typescript
// MANDATORY AI service structure
class AIService {
  private model: 'gemini-pro';
  
  async generateResume(profile: UserProfile, jobDescription: string): Promise<string> {
    // ALWAYS validate inputs
    // ALWAYS use structured prompts
    // ALWAYS handle rate limits
    // ALWAYS log usage for cost tracking
  }
  
  async generateCoverLetter(profile: UserProfile, jobInfo: JobInfo): Promise<string> {
    // Same validation and logging requirements
  }
}
```

### Prompt Engineering Rules
- **ALWAYS** use structured prompts with clear sections
- **ALWAYS** include context about CraftlyCV brand
- **ALWAYS** specify output format requirements
- **NEVER** expose user data in logs
- **ALWAYS** implement fallback responses

### AI Content Quality Standards
- ✅ Human-like, professional tone
- ✅ ATS-optimized keyword usage
- ✅ Tailored to specific job requirements
- ✅ Consistent with user profile data
- ✅ Proper grammar and formatting

---

## 📱 Component Development Rules

### React Component Standards
```typescript
// MANDATORY component structure
interface ComponentProps {
  // Always define prop interfaces
}

const ComponentName: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // ALWAYS use TypeScript
  // ALWAYS handle loading states
  // ALWAYS handle error states
  // ALWAYS use proper accessibility attributes
  
  return (
    <div className="component-container">
      {/* ALWAYS use semantic HTML */}
      {/* ALWAYS include proper ARIA labels */}
    </div>
  );
};

export default ComponentName;
```

### Form Component Rules
- **ALWAYS** use controlled components
- **ALWAYS** implement proper validation
- **ALWAYS** show loading states during submission
- **ALWAYS** handle errors gracefully
- **ALWAYS** provide clear feedback to users

### State Management Rules
```typescript
// ONLY use React Context for global state
const AppContext = createContext<AppState>({} as AppState);

// NEVER use prop drilling for more than 2 levels
// ALWAYS use custom hooks for complex state logic
const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within ProfileProvider');
  return context;
};
```

---

## 🧪 Testing Rules

### Testing Requirements
- **ALWAYS** write unit tests for utility functions
- **ALWAYS** test form validation logic
- **ALWAYS** test API integration points
- **ALWAYS** test authentication flows
- **NEVER** commit code without passing tests

### Test Structure
```typescript
// MANDATORY test file structure
describe('ComponentName', () => {
  beforeEach(() => {
    // Setup
  });
  
  it('should render correctly', () => {
    // Test rendering
  });
  
  it('should handle user interactions', () => {
    // Test interactions
  });
  
  it('should handle error states', () => {
    // Test error handling
  });
});
```

---

## 🚀 Performance Rules

### Code Splitting Requirements
```typescript
// ALWAYS lazy load heavy components
const ProfileBuilder = lazy(() => import('@/components/features/profile/ProfileBuilder'));
const ResumeGenerator = lazy(() => import('@/components/features/generation/ResumeGenerator'));

// ALWAYS wrap with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ProfileBuilder />
</Suspense>
```

### Optimization Checklist
- ✅ Use React.memo for expensive components
- ✅ Implement debounced auto-save
- ✅ Optimize images and assets
- ✅ Minimize bundle size
- ✅ Use proper caching strategies

---

## 📊 Analytics & Monitoring Rules

### Required Tracking Events
```typescript
// MANDATORY analytics events
const ANALYTICS_EVENTS = {
  USER_SIGNUP: 'user_signup',
  PROFILE_COMPLETED: 'profile_completed',
  RESUME_GENERATED: 'resume_generated',
  COVER_LETTER_GENERATED: 'cover_letter_generated',
  PDF_DOWNLOADED: 'pdf_downloaded',
  APPLICATION_CREATED: 'application_created'
};
```

### Error Tracking Requirements
- **ALWAYS** log errors with context
- **ALWAYS** track performance metrics
- **NEVER** log sensitive user data
- **ALWAYS** monitor AI API usage and costs

---

## 🔄 Development Workflow Rules

### Git Workflow
- **ALWAYS** use feature branches
- **ALWAYS** write descriptive commit messages
- **NEVER** commit directly to main branch
- **ALWAYS** run tests before pushing

### Code Review Checklist
- ✅ Follows project architecture
- ✅ Adheres to naming conventions
- ✅ Includes proper error handling
- ✅ Has appropriate tests
- ✅ Follows security guidelines
- ✅ Maintains performance standards

### Deployment Rules
- **ALWAYS** test in staging environment first
- **ALWAYS** run security scans
- **ALWAYS** backup data before major deployments
- **NEVER** deploy on Fridays (unless critical)

---

## 🎯 Feature Development Priorities

### Phase-Based Development (STRICT ORDER)
1. **Authentication & User Management**
2. **Profile Builder**
3. **AI Content Generation**
4. **PDF Export**
5. **Application Management**
6. **UI/UX Polish**
7. **Testing & Deployment**
8. **Advanced Features**

### Feature Acceptance Criteria
- ✅ Matches functional requirements
- ✅ Follows brand guidelines
- ✅ Passes all tests
- ✅ Meets performance standards
- ✅ Includes proper documentation

---

## 🚨 Critical Don'ts

### Architecture Violations
- ❌ **NEVER** use traditional SQL databases
- ❌ **NEVER** implement custom authentication
- ❌ **NEVER** bypass Firebase security rules
- ❌ **NEVER** store sensitive data in localStorage
- ❌ **NEVER** make direct API calls from client to external services

### Code Quality Violations
- ❌ **NEVER** use `any` type in TypeScript
- ❌ **NEVER** ignore ESLint warnings
- ❌ **NEVER** commit commented-out code
- ❌ **NEVER** use inline styles
- ❌ **NEVER** hardcode API keys or secrets

### User Experience Violations
- ❌ **NEVER** show technical error messages to users
- ❌ **NEVER** block UI without loading indicators
- ❌ **NEVER** ignore accessibility requirements
- ❌ **NEVER** break mobile responsiveness

---

## 📋 Daily Development Checklist

### Before Starting Work
- [ ] Pull latest changes from main branch
- [ ] Review current phase requirements
- [ ] Check Firebase quotas and usage
- [ ] Verify development environment setup

### During Development
- [ ] Follow naming conventions
- [ ] Write TypeScript interfaces first
- [ ] Implement error handling
- [ ] Add loading states
- [ ] Test on mobile devices

### Before Committing
- [ ] Run `npm run build` successfully
- [ ] Run `npm test` with all tests passing
- [ ] Check ESLint warnings
- [ ] Verify Firebase security rules
- [ ] Test authentication flows

---

## 🎯 Success Metrics

### Technical Metrics
- **Build Time**: < 2 minutes
- **Page Load Speed**: < 2 seconds
- **Test Coverage**: > 80%
- **Bundle Size**: < 1MB
- **Lighthouse Score**: > 90

### User Experience Metrics
- **Profile Completion Rate**: > 80%
- **Generation Success Rate**: > 95%
- **User Retention**: > 60% weekly
- **Error Rate**: < 1%

---

## 📞 Emergency Procedures

### Production Issues
1. **Immediately** check Firebase console for errors
2. **Review** recent deployments and rollback if necessary
3. **Monitor** user reports and analytics
4. **Document** issues and resolutions

### Security Incidents
1. **Immediately** disable affected features
2. **Review** Firebase security rules
3. **Check** for data breaches
4. **Notify** users if necessary

---

**Rules Version**: 1.0  
**Last Updated**: January 2025  
**Maintainer**: Dr Mohamed  
**Status**: ACTIVE - MUST BE FOLLOWED

> 🎯 **These rules are non-negotiable and must be followed throughout the entire development lifecycle of CraftlyCV. Any deviations must be documented and approved.**