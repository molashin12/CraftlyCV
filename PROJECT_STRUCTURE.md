# 📁 CraftlyCV Project Structure

This document outlines the complete folder structure and file organization for the CraftlyCV project.

---

## 🏗️ Complete Project Structure

```
craftlycv/
├── 📁 .github/
│   └── 📁 workflows/
│       ├── deploy.yml
│       ├── test.yml
│       └── security-scan.yml
│
├── 📁 .next/                     # Next.js build output (auto-generated)
├── 📁 .firebase/                 # Firebase cache (auto-generated)
├── 📁 node_modules/              # Dependencies (auto-generated)
│
├── 📁 public/
│   ├── 📁 icons/
│   │   ├── favicon.ico
│   │   ├── icon-192.png
│   │   └── icon-512.png
│   ├── 📁 images/
│   │   ├── logo.svg
│   │   ├── hero-bg.svg
│   │   └── template-previews/
│   ├── 📁 templates/
│   │   ├── modern-template.html
│   │   ├── classic-template.html
│   │   └── creative-template.html
│   ├── manifest.json
│   └── robots.txt
│
├── 📁 src/
│   ├── 📁 app/                   # Next.js 13+ App Router
│   │   ├── 📁 (auth)/
│   │   │   ├── 📁 login/
│   │   │   │   └── page.tsx
│   │   │   └── 📁 signup/
│   │   │       └── page.tsx
│   │   ├── 📁 dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── 📁 profile/
│   │   │   │   └── page.tsx
│   │   │   ├── 📁 applications/
│   │   │   │   ├── page.tsx
│   │   │   │   └── 📁 [id]/
│   │   │   │       └── page.tsx
│   │   │   └── 📁 settings/
│   │   │       └── page.tsx
│   │   ├── 📁 generate/
│   │   │   ├── page.tsx
│   │   │   ├── 📁 resume/
│   │   │   │   └── page.tsx
│   │   │   └── 📁 cover-letter/
│   │   │       └── page.tsx
│   │   ├── 📁 api/               # API Routes
│   │   │   ├── 📁 auth/
│   │   │   ├── 📁 profile/
│   │   │   └── 📁 webhooks/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── loading.tsx
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   │
│   ├── 📁 components/
│   │   ├── 📁 ui/                # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── index.ts
│   │   ├── 📁 forms/             # Form components
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── ExperienceForm.tsx
│   │   │   ├── EducationForm.tsx
│   │   │   ├── SkillsForm.tsx
│   │   │   └── JobDescriptionForm.tsx
│   │   ├── 📁 layout/            # Layout components
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── DashboardLayout.tsx
│   │   ├── 📁 features/          # Feature-specific components
│   │   │   ├── 📁 auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── SignupForm.tsx
│   │   │   │   └── AuthGuard.tsx
│   │   │   ├── 📁 profile/
│   │   │   │   ├── ProfileBuilder.tsx
│   │   │   │   ├── ProfilePreview.tsx
│   │   │   │   ├── ProfileProgress.tsx
│   │   │   │   └── ProfileSections/
│   │   │   │       ├── PersonalInfo.tsx
│   │   │   │       ├── Experience.tsx
│   │   │   │       ├── Education.tsx
│   │   │   │       └── Skills.tsx
│   │   │   ├── 📁 generation/
│   │   │   │   ├── ResumeGenerator.tsx
│   │   │   │   ├── CoverLetterGenerator.tsx
│   │   │   │   ├── MatchScoreDisplay.tsx
│   │   │   │   ├── TemplateSelector.tsx
│   │   │   │   └── GenerationProgress.tsx
│   │   │   ├── 📁 applications/
│   │   │   │   ├── ApplicationsList.tsx
│   │   │   │   ├── ApplicationCard.tsx
│   │   │   │   ├── ApplicationDetails.tsx
│   │   │   │   └── ApplicationFilters.tsx
│   │   │   └── 📁 templates/
│   │   │       ├── TemplatePreview.tsx
│   │   │       ├── TemplateCustomizer.tsx
│   │   │       └── PDFViewer.tsx
│   │   └── 📁 common/            # Common components
│   │       ├── ErrorBoundary.tsx
│   │       ├── SEOHead.tsx
│   │       ├── Analytics.tsx
│   │       └── PWAInstallPrompt.tsx
│   │
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useProfile.ts
│   │   ├── useApplications.ts
│   │   ├── useGeneration.ts
│   │   ├── useTemplates.ts
│   │   ├── useLocalStorage.ts
│   │   ├── useDebounce.ts
│   │   ├── useAutoSave.ts
│   │   └── useAnalytics.ts
│   │
│   ├── 📁 contexts/              # React contexts
│   │   ├── AuthContext.tsx
│   │   ├── ProfileContext.tsx
│   │   ├── ApplicationContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── ToastContext.tsx
│   │
│   ├── 📁 lib/                   # Core libraries and utilities
│   │   ├── firebase.ts
│   │   ├── ai-service.ts
│   │   ├── pdf-generator.ts
│   │   ├── web-scraper.ts
│   │   ├── email-service.ts
│   │   ├── analytics.ts
│   │   └── constants.ts
│   │
│   ├── 📁 services/              # API and external services
│   │   ├── 📁 firebase/
│   │   │   ├── auth.ts
│   │   │   ├── firestore.ts
│   │   │   ├── functions.ts
│   │   │   └── storage.ts
│   │   ├── 📁 ai/
│   │   │   ├── openai.ts
│   │   │   ├── claude.ts
│   │   │   ├── prompts.ts
│   │   │   └── content-generator.ts
│   │   ├── 📁 external/
│   │   │   ├── linkedin-scraper.ts
│   │   │   ├── indeed-scraper.ts
│   │   │   └── job-parser.ts
│   │   └── api.ts
│   │
│   ├── 📁 utils/                 # Utility functions
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   ├── date-utils.ts
│   │   ├── string-utils.ts
│   │   ├── file-utils.ts
│   │   ├── url-utils.ts
│   │   ├── error-handling.ts
│   │   └── performance.ts
│   │
│   ├── 📁 types/                 # TypeScript type definitions
│   │   ├── auth.ts
│   │   ├── profile.ts
│   │   ├── application.ts
│   │   ├── template.ts
│   │   ├── ai.ts
│   │   ├── api.ts
│   │   └── index.ts
│   │
│   ├── 📁 styles/                # Styling files
│   │   ├── globals.css
│   │   ├── components.css
│   │   ├── templates.css
│   │   └── print.css
│   │
│   └── 📁 data/                  # Static data and configurations
│       ├── templates.json
│       ├── skills-database.json
│       ├── countries.json
│       └── sample-data.json
│
├── 📁 functions/                 # Firebase Cloud Functions
│   ├── 📁 src/
│   │   ├── 📁 ai/
│   │   │   ├── resume-generator.ts
│   │   │   ├── cover-letter-generator.ts
│   │   │   ├── match-scorer.ts
│   │   │   └── content-optimizer.ts
│   │   ├── 📁 utils/
│   │   │   ├── job-parser.ts
│   │   │   ├── web-scraper.ts
│   │   │   ├── pdf-generator.ts
│   │   │   └── email-sender.ts
│   │   ├── 📁 triggers/
│   │   │   ├── user-created.ts
│   │   │   ├── application-created.ts
│   │   │   └── cleanup-tasks.ts
│   │   ├── 📁 scheduled/
│   │   │   ├── daily-cleanup.ts
│   │   │   ├── analytics-aggregation.ts
│   │   │   └── backup-data.ts
│   │   ├── index.ts
│   │   └── config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── .gitignore
│
├── 📁 docs/                      # Documentation
│   ├── api-reference.md
│   ├── deployment-guide.md
│   ├── user-guide.md
│   └── troubleshooting.md
│
├── 📁 tests/                     # Test files
│   ├── 📁 __mocks__/
│   ├── 📁 components/
│   ├── 📁 hooks/
│   ├── 📁 utils/
│   ├── 📁 integration/
│   ├── 📁 e2e/
│   ├── setup.ts
│   └── jest.config.js
│
├── 📁 scripts/                   # Build and deployment scripts
│   ├── build.sh
│   ├── deploy.sh
│   ├── seed-data.ts
│   └── backup.sh
│
├── .env.local                    # Environment variables (local)
├── .env.example                  # Environment variables template
├── .gitignore
├── .eslintrc.json
├── .prettierrc
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
├── package.json
├── package-lock.json
├── README.md
├── CHANGELOG.md
└── LICENSE
```

---

## 📋 Key Files Explanation

### 🔧 Configuration Files

| File | Purpose |
|------|----------|
| `next.config.js` | Next.js configuration |
| `tailwind.config.js` | Tailwind CSS customization |
| `firebase.json` | Firebase project configuration |
| `firestore.rules` | Database security rules |
| `tsconfig.json` | TypeScript configuration |
| `.eslintrc.json` | Code linting rules |
| `.prettierrc` | Code formatting rules |

### 🎯 Core Application Files

| File/Folder | Purpose |
|-------------|----------|
| `src/app/` | Next.js App Router pages |
| `src/components/` | Reusable React components |
| `src/hooks/` | Custom React hooks |
| `src/lib/` | Core libraries and configurations |
| `src/services/` | External API integrations |
| `src/types/` | TypeScript type definitions |
| `functions/` | Firebase Cloud Functions |

---

## 🏗️ Component Architecture

### UI Component Hierarchy

```
App
├── AuthGuard
│   ├── DashboardLayout
│   │   ├── Header
│   │   ├── Sidebar
│   │   └── Main Content
│   │       ├── ProfileBuilder
│   │       │   ├── PersonalInfo
│   │       │   ├── Experience
│   │       │   ├── Education
│   │       │   └── Skills
│   │       ├── ResumeGenerator
│   │       │   ├── JobDescriptionForm
│   │       │   ├── TemplateSelector
│   │       │   ├── GenerationProgress
│   │       │   └── ResumePreview
│   │       └── ApplicationsList
│   │           ├── ApplicationCard
│   │           ├── ApplicationFilters
│   │           └── ApplicationDetails
│   └── Footer
└── Toast Notifications
```

---

## 📁 Folder Naming Conventions

### 📂 Folder Structure Rules

- **kebab-case**: For URLs and file names (`cover-letter`, `job-description`)
- **PascalCase**: For React components (`ProfileBuilder.tsx`)
- **camelCase**: For functions and variables (`generateResume`)
- **UPPER_CASE**: For constants and environment variables (`API_KEY`)

### 📄 File Naming Patterns

| Type | Pattern | Example |
|------|---------|----------|
| **React Components** | `PascalCase.tsx` | `ProfileBuilder.tsx` |
| **Hooks** | `use[Name].ts` | `useAuth.ts` |
| **Services** | `kebab-case.ts` | `ai-service.ts` |
| **Types** | `kebab-case.ts` | `user-profile.ts` |
| **Utils** | `kebab-case.ts` | `date-utils.ts` |
| **Pages** | `page.tsx` | `page.tsx` |
| **Layouts** | `layout.tsx` | `layout.tsx` |

---

## 🔄 Import/Export Patterns

### Barrel Exports (index.ts files)

```typescript
// src/components/ui/index.ts
export { Button } from './Button';
export { Input } from './Input';
export { Card } from './Card';
export { Modal } from './Modal';

// Usage
import { Button, Input, Card } from '@/components/ui';
```

### Absolute Imports Configuration

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

---

## 🧪 Testing Structure

### Test File Organization

```
tests/
├── components/
│   ├── ProfileBuilder.test.tsx
│   ├── ResumeGenerator.test.tsx
│   └── __snapshots__/
├── hooks/
│   ├── useAuth.test.ts
│   └── useProfile.test.ts
├── utils/
│   ├── validation.test.ts
│   └── formatting.test.ts
├── integration/
│   ├── auth-flow.test.ts
│   └── generation-flow.test.ts
└── e2e/
    ├── user-journey.spec.ts
    └── performance.spec.ts
```

### Test Naming Convention

- **Unit Tests**: `[ComponentName].test.tsx`
- **Integration Tests**: `[feature]-flow.test.ts`
- **E2E Tests**: `[user-journey].spec.ts`

---

## 🚀 Build and Deployment Structure

### Environment-Specific Files

```
├── .env.local              # Local development
├── .env.staging            # Staging environment
├── .env.production         # Production environment
└── .env.example            # Template for new developers
```

### Firebase Configuration

```
├── firebase.json           # Main Firebase config
├── firestore.rules         # Database security rules
├── firestore.indexes.json  # Database indexes
├── storage.rules           # Storage security rules
└── functions/
    ├── package.json        # Functions dependencies
    └── .env                # Functions environment variables
```

---

## 📊 Performance Optimization Structure

### Code Splitting Points

```typescript
// Lazy load heavy components
const ProfileBuilder = lazy(() => import('@/components/features/profile/ProfileBuilder'));
const ResumeGenerator = lazy(() => import('@/components/features/generation/ResumeGenerator'));
const PDFViewer = lazy(() => import('@/components/features/templates/PDFViewer'));

// Route-based splitting (automatic with Next.js App Router)
// Each page.tsx file becomes a separate chunk
```

### Asset Organization

```
public/
├── icons/
│   ├── favicon.ico         # 16x16, 32x32
│   ├── icon-192.png        # PWA icon
│   └── icon-512.png        # PWA icon
├── images/
│   ├── logo.svg            # Vector logo
│   ├── hero-bg.svg         # Optimized background
│   └── template-previews/  # Template thumbnails
└── templates/
    ├── modern.html         # PDF template
    ├── classic.html        # PDF template
    └── creative.html       # PDF template
```

---

## 🔐 Security File Organization

### Security-Related Files

```
├── firestore.rules         # Database access rules
├── storage.rules           # File storage rules
├── functions/src/middleware/
│   ├── auth-middleware.ts  # Authentication checks
│   ├── rate-limiter.ts     # API rate limiting
│   └── input-validator.ts  # Input sanitization
└── src/utils/
    ├── validation.ts       # Client-side validation
    └── sanitization.ts     # Data sanitization
```

---

## 📱 Progressive Web App Structure

### PWA Files

```
public/
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (auto-generated)
└── icons/
    ├── icon-192.png        # Required PWA icon
    └── icon-512.png        # Required PWA icon

src/
└── components/common/
    └── PWAInstallPrompt.tsx # Install prompt component
```

---

## 🎯 Development Workflow

### Git Workflow Structure

```
.github/
├── workflows/
│   ├── deploy.yml          # Deployment pipeline
│   ├── test.yml            # Testing pipeline
│   └── security-scan.yml   # Security checks
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   └── feature_request.md
└── pull_request_template.md
```

### Scripts Organization

```
scripts/
├── build.sh                # Production build
├── deploy.sh               # Deployment script
├── seed-data.ts            # Database seeding
├── backup.sh               # Data backup
└── setup-dev.sh            # Development setup
```

---

**Project Structure Version**: 1.0  
**Last Updated**: January 2025  
**Maintainer**: Dr Mohamed

> 🎯 This structure is designed for scalability, maintainability, and team collaboration. Follow the conventions consistently for the best development experience.