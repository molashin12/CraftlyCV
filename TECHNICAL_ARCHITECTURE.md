# 🏗️ CraftlyCV Technical Architecture

## 📊 System Overview

**CraftlyCV** is a modern, serverless web application built on Firebase that leverages AI to generate personalized job applications. The architecture follows a microservices pattern with clear separation of concerns.

---

## 🎯 Architecture Principles

- **Serverless-First**: Minimize infrastructure management
- **Real-time**: Live updates and collaborative features
- **Scalable**: Handle growth from 10 to 10,000+ users
- **Cost-Effective**: Pay-per-use model
- **Secure**: Enterprise-grade security with Firebase
- **Mobile-Responsive**: Progressive Web App (PWA) ready

---

## 🏛️ High-Level Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Firebase       │    │   External      │
│   (Next.js)     │◄──►│   Backend        │◄──►│   Services      │
│                 │    │                  │    │                 │
│ • React/Next.js │    │ • Authentication │    │ • Google Gemini │
│ • TypeScript    │    │ • Firestore DB   │    │ • Web Scraping  │
│ • Tailwind CSS  │    │ • Cloud Functions│    │ • Email Service │
│ • PWA Ready     │    │ • Hosting        │    │ • Analytics     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 🗄️ Data Architecture

### Firestore Database Structure

```
craftlycv-db/
├── users/{userId}
│   ├── profile: UserProfile
│   ├── settings: UserSettings
│   └── metadata: UserMetadata
│
├── applications/{applicationId}
│   ├── jobInfo: JobInformation
│   ├── generatedContent: GeneratedContent
│   ├── matchScore: MatchAnalysis
│   └── metadata: ApplicationMetadata
│
├── templates/{templateId}
│   ├── design: TemplateDesign
│   ├── structure: TemplateStructure
│   └── metadata: TemplateMetadata
│
└── analytics/{userId}
    ├── usage: UsageStats
    ├── performance: PerformanceMetrics
    └── feedback: UserFeedback
```

---

## 📋 Data Models

### User Profile
```typescript
interface UserProfile {
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    location: {
      city: string;
      country: string;
    };
    linkedinUrl?: string;
    portfolioUrl?: string;
    profilePhoto?: string;
  };
  
  // Professional Summary
  summary: {
    headline: string;
    description: string;
    careerObjective?: string;
  };
  
  // Work Experience
  experience: WorkExperience[];
  
  // Education
  education: Education[];
  
  // Skills
  skills: {
    technical: Skill[];
    soft: Skill[];
    languages: Language[];
  };
  
  // Metadata
  metadata: {
    completionPercentage: number;
    lastUpdated: Timestamp;
    version: number;
  };
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: Date;
  endDate?: Date; // null if current
  isCurrent: boolean;
  description: string;
  achievements: string[];
  technologies?: string[];
  industry?: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: Date;
  endDate?: Date;
  gpa?: number;
  honors?: string[];
  relevantCoursework?: string[];
  location: string;
}

interface Skill {
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  yearsOfExperience?: number;
  certifications?: string[];
}

interface Language {
  name: string;
  proficiency: 'Basic' | 'Conversational' | 'Fluent' | 'Native';
  certifications?: string[];
}
```

### Application Data
```typescript
interface Application {
  id: string;
  userId: string;
  
  // Job Information
  jobInfo: {
    title: string;
    company: string;
    location: string;
    description: string;
    requirements: string[];
    sourceUrl?: string;
    salary?: {
      min?: number;
      max?: number;
      currency: string;
    };
  };
  
  // Generated Content
  generatedContent: {
    resume: {
      content: string;
      templateId: string;
      customizations: Record<string, any>;
    };
    coverLetter: {
      content: string;
      tone: 'Professional' | 'Friendly' | 'Formal';
      length: 'Short' | 'Medium' | 'Long';
    };
  };
  
  // AI Analysis
  matchAnalysis: {
    overallScore: number; // 0-100
    skillsMatch: {
      matched: string[];
      missing: string[];
      score: number;
    };
    experienceMatch: {
      relevantYears: number;
      industryMatch: boolean;
      score: number;
    };
    keywordAnalysis: {
      jobKeywords: string[];
      resumeKeywords: string[];
      matchedKeywords: string[];
      score: number;
    };
    improvements: {
      category: string;
      suggestion: string;
      impact: 'High' | 'Medium' | 'Low';
    }[];
  };
  
  // Application Status
  status: 'draft' | 'generated' | 'applied' | 'interview' | 'offer' | 'rejected';
  
  // Metadata
  metadata: {
    createdAt: Timestamp;
    updatedAt: Timestamp;
    generationTime: number; // milliseconds
    aiModel: string;
    version: number;
  };
}
```

### Template System
```typescript
interface Template {
  id: string;
  name: string;
  category: 'Modern' | 'Classic' | 'Creative' | 'Minimal';
  
  design: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      text: string;
    };
    fonts: {
      heading: string;
      body: string;
      size: {
        heading: string;
        body: string;
      };
    };
    layout: {
      columns: 1 | 2;
      spacing: 'Compact' | 'Normal' | 'Spacious';
      margins: string;
    };
  };
  
  structure: {
    sections: TemplateSection[];
    order: string[];
  };
  
  metadata: {
    isActive: boolean;
    isPremium: boolean;
    popularity: number;
    createdAt: Timestamp;
  };
}

interface TemplateSection {
  id: string;
  name: string;
  type: 'header' | 'summary' | 'experience' | 'education' | 'skills' | 'custom';
  isRequired: boolean;
  isVisible: boolean;
  customization: {
    allowReorder: boolean;
    allowHide: boolean;
    allowCustomTitle: boolean;
  };
}
```

---

## ⚡ Firebase Functions Architecture

### Core Functions

```typescript
// AI Content Generation
export const generateResume = functions
  .runWith({ timeoutSeconds: 300, memory: '1GB' })
  .https.onCall(async (data: GenerateResumeRequest, context) => {
    // Validate authentication
    // Fetch user profile
    // Process job description
    // Generate AI content
    // Save to Firestore
    // Return generated content
  });

export const generateCoverLetter = functions
  .runWith({ timeoutSeconds: 300, memory: '1GB' })
  .https.onCall(async (data: GenerateCoverLetterRequest, context) => {
    // Similar to generateResume
  });

export const calculateMatchScore = functions
  .runWith({ timeoutSeconds: 60, memory: '512MB' })
  .https.onCall(async (data: MatchScoreRequest, context) => {
    // Analyze job requirements vs user profile
    // Calculate compatibility scores
    // Generate improvement suggestions
  });

// Utility Functions
export const extractJobFromUrl = functions
  .runWith({ timeoutSeconds: 120, memory: '512MB' })
  .https.onCall(async (data: { url: string }, context) => {
    // Web scraping for job descriptions
    // Support LinkedIn, Indeed, etc.
  });

export const generatePDF = functions
  .runWith({ timeoutSeconds: 180, memory: '1GB' })
  .https.onCall(async (data: PDFGenerationRequest, context) => {
    // Convert HTML resume to PDF
    // Apply template styling
    // Return download URL
  });

// Background Tasks
export const updateUserAnalytics = functions.firestore
  .document('applications/{applicationId}')
  .onCreate(async (snap, context) => {
    // Update user usage statistics
    // Track popular features
  });

export const cleanupOldApplications = functions.pubsub
  .schedule('0 2 * * *') // Daily at 2 AM
  .onRun(async (context) => {
    // Clean up old draft applications
    // Archive completed applications
  });
```

---

## 🔐 Security Architecture

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Applications belong to specific users
    match /applications/{applicationId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && 
        request.auth.uid == request.resource.data.userId;
    }
    
    // Templates are read-only for users
    match /templates/{templateId} {
      allow read: if request.auth != null;
      allow write: if false; // Only admin can modify
    }
    
    // Analytics data
    match /analytics/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Authentication Flow

```typescript
// Authentication states
type AuthState = 'loading' | 'authenticated' | 'unauthenticated';

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (!user) return <LoginPage />;
  
  return <>{children}</>;
};

// API security
const validateUser = (context: CallableContext) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated'
    );
  }
  return context.auth.uid;
};
```

---

## 📊 Performance Optimization

### Frontend Optimization

```typescript
// Code splitting
const ProfileBuilder = lazy(() => import('@/components/ProfileBuilder'));
const ResumeGenerator = lazy(() => import('@/components/ResumeGenerator'));

// Memoization for expensive operations
const MemoizedResumePreview = memo(ResumePreview);

// Debounced auto-save
const useAutoSave = (data: any, delay: number = 1000) => {
  const debouncedSave = useMemo(
    () => debounce((data) => saveToFirestore(data), delay),
    [delay]
  );
  
  useEffect(() => {
    debouncedSave(data);
  }, [data, debouncedSave]);
};
```

### Database Optimization

```typescript
// Efficient queries with indexing
const getUserApplications = async (userId: string, limit: number = 10) => {
  return await db
    .collection('applications')
    .where('userId', '==', userId)
    .orderBy('metadata.createdAt', 'desc')
    .limit(limit)
    .get();
};

// Pagination for large datasets
const getPaginatedApplications = async (
  userId: string,
  lastDoc?: DocumentSnapshot,
  limit: number = 10
) => {
  let query = db
    .collection('applications')
    .where('userId', '==', userId)
    .orderBy('metadata.createdAt', 'desc')
    .limit(limit);
    
  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }
  
  return await query.get();
};
```

---

## 🔄 State Management

### Context-Based State

```typescript
// Global app state
interface AppState {
  user: User | null;
  profile: UserProfile | null;
  currentApplication: Application | null;
  templates: Template[];
  loading: {
    profile: boolean;
    generation: boolean;
    pdf: boolean;
  };
  errors: {
    [key: string]: string | null;
  };
}

// State management with Context + Reducer
const AppContext = createContext<{
  state: AppState;
  dispatch: Dispatch<AppAction>;
}>({} as any);

// Actions
type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'SET_LOADING'; payload: { key: string; value: boolean } }
  | { type: 'SET_ERROR'; payload: { key: string; error: string | null } };
```

---

## 📈 Monitoring & Analytics

### Performance Monitoring

```typescript
// Custom performance tracking
const trackPerformance = (operation: string, duration: number) => {
  // Firebase Performance Monitoring
  const trace = performance().trace(operation);
  trace.putMetric('duration', duration);
  trace.stop();
};

// Error tracking
const trackError = (error: Error, context: string) => {
  console.error(`Error in ${context}:`, error);
  // Send to error tracking service
};

// User analytics
const trackUserAction = (action: string, properties?: Record<string, any>) => {
  // Firebase Analytics
  analytics().logEvent(action, properties);
};
```

---

## 🚀 Deployment Strategy

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build project
        run: npm run build
      
      - name: Deploy to Firebase
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: craftlycv-prod
```

### Environment Management

```typescript
// Environment-specific configurations
const config = {
  development: {
    apiUrl: 'http://localhost:3000',
    aiModel: 'gemini-pro',
    debugMode: true,
  },
  staging: {
    apiUrl: 'https://staging.craftlycv.com',
    aiModel: 'gemini-pro',
    debugMode: true,
  },
  production: {
    apiUrl: 'https://craftlycv.com',
    aiModel: 'gpt-4',
    debugMode: false,
  },
};
```

---

## 💰 Cost Optimization

### Firebase Usage Optimization

```typescript
// Efficient Firestore operations
const batchWrite = async (operations: any[]) => {
  const batch = db.batch();
  operations.forEach(op => batch.set(op.ref, op.data));
  await batch.commit();
};

// Cache frequently accessed data
const useTemplatesCache = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [lastFetch, setLastFetch] = useState<number>(0);
  
  const fetchTemplates = useCallback(async () => {
    const now = Date.now();
    if (now - lastFetch < 5 * 60 * 1000) return; // 5 min cache
    
    const snapshot = await db.collection('templates').get();
    setTemplates(snapshot.docs.map(doc => doc.data() as Template));
    setLastFetch(now);
  }, [lastFetch]);
  
  return { templates, fetchTemplates };
};
```

---

## 🔮 Scalability Considerations

### Horizontal Scaling
- **Firestore**: Auto-scales with usage
- **Cloud Functions**: Concurrent execution scaling
- **CDN**: Global content delivery via Firebase Hosting
- **Caching**: Redis for session data (future)

### Performance Targets
- **Page Load**: < 2 seconds
- **AI Generation**: < 30 seconds
- **PDF Export**: < 10 seconds
- **Database Queries**: < 500ms

---

**Architecture Version**: 1.0  
**Last Updated**: January 2025  
**Maintainer**: Dr Mohamed

> 🎯 This architecture is designed to scale from MVP to enterprise-level usage while maintaining cost efficiency and performance.