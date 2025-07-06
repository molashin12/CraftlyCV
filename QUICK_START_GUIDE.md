# ⚡ CraftlyCV Quick Start Guide

## 🚀 Get Started in 30 Minutes

This guide will help you set up the basic foundation of CraftlyCV and get your first prototype running.

---

## 📋 Prerequisites

- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Google account for Firebase
- [ ] Code editor (VS Code recommended)
- [ ] Basic knowledge of React/TypeScript

---

## 🔥 Step 1: Firebase Project Setup (5 minutes)

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Create a project"
3. Name it `craftlycv-[your-name]`
4. Enable Google Analytics (optional)
5. Wait for project creation

### Enable Required Services
```bash
# In Firebase Console:
1. Authentication → Get Started → Sign-in method → Google (Enable)
2. Firestore Database → Create database → Start in test mode
3. Functions → Get Started
4. Hosting → Get Started
```

---

## 💻 Step 2: Local Development Setup (10 minutes)

### Install Firebase CLI
```bash
npm install -g firebase-tools
firebase login
```

### Create Next.js Project
```bash
# Navigate to your coding directory
cd d:/CODING/CraftlyCV

# Create Next.js app
npx create-next-app@latest craftlycv-app --typescript --tailwind --eslint --app
cd craftlycv-app

# Install Firebase SDK
npm install firebase

# Install additional dependencies
npm install @heroicons/react lucide-react
npm install -D @types/node
```

### Initialize Firebase in Project
```bash
firebase init
# Select:
# - Firestore
# - Functions
# - Hosting
# - Use existing project (select your CraftlyCV project)
# - TypeScript for Functions
# - Install dependencies: Yes
# - Public directory: out (for Next.js static export)
```

---

## ⚙️ Step 3: Basic Configuration (10 minutes)

### Firebase Configuration
Create `src/lib/firebase.ts`:
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  // Get these from Firebase Console → Project Settings → General
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
```

### Environment Variables
Create `.env.local`:
```env
# Get these values from Firebase Console → Project Settings → General → Your apps
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_key
```

### Tailwind Configuration
Update `tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-navy': '#1C2B39',
        'pen-blue': '#0D4D7A',
        'soft-bg': '#F7F9FA',
        'dark-text': '#1C1C1C',
        'success-green': '#27AE60',
        'warning-red': '#E74C3C',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

---

## 🎨 Step 4: Create Basic Components (5 minutes)

### Authentication Context
Create `src/contexts/AuthContext.tsx`:
```typescript
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Basic Layout
Update `src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({ 
  weight: ['400', '600', '700'], 
  subsets: ['latin'], 
  variable: '--font-poppins' 
})

export const metadata: Metadata = {
  title: 'CraftlyCV - Smart Job Application Assistant',
  description: 'AI-powered platform for creating tailored resumes and cover letters',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${poppins.variable} font-inter`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

### Landing Page
Update `src/app/page.tsx`:
```typescript
'use client';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const { user, loading, signInWithGoogle, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-soft-bg flex items-center justify-center">
        <div className="text-primary-navy text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-soft-bg">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center">
          <h1 className="font-poppins font-bold text-4xl md:text-6xl text-primary-navy mb-6">
            💼 CraftlyCV
          </h1>
          <p className="text-xl text-dark-text mb-8 max-w-2xl mx-auto">
            The Smart Job Application Assistant - Build your profile once, apply everywhere with AI-customized applications.
          </p>
          
          {user ? (
            <div className="space-y-4">
              <p className="text-lg">Welcome, {user.displayName}!</p>
              <div className="space-x-4">
                <button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="bg-primary-navy text-white px-8 py-3 rounded-2xl hover:bg-pen-blue transition-colors"
                >
                  Go to Dashboard
                </button>
                <button 
                  onClick={logout}
                  className="bg-gray-500 text-white px-8 py-3 rounded-2xl hover:bg-gray-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={signInWithGoogle}
              className="bg-primary-navy text-white px-8 py-4 rounded-2xl text-lg hover:bg-pen-blue transition-colors"
            >
              🚀 Get Started with Google
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 🧪 Step 5: Test Your Setup

### Run Development Server
```bash
npm run dev
```

### Test Checklist
- [ ] App loads at `http://localhost:3000`
- [ ] CraftlyCV branding appears correctly
- [ ] Google sign-in button works
- [ ] Authentication state persists on refresh
- [ ] No console errors

---

## 🎯 Next Steps

### Immediate (Today)
1. **Complete the setup above**
2. **Test Google authentication**
3. **Familiarize yourself with Firebase Console**

### This Week
1. **Follow Phase 2 of the roadmap** (User Profile Foundation)
2. **Create basic profile form components**
3. **Set up Firestore data structure**

### Next Week
1. **Implement profile builder UI**
2. **Add form validation**
3. **Start AI integration planning**

---

## 🆘 Troubleshooting

### Common Issues

**Firebase Config Errors**
- Double-check environment variables in `.env.local`
- Ensure Firebase project is properly initialized
- Verify API keys from Firebase Console

**Authentication Issues**
- Enable Google provider in Firebase Console
- Check authorized domains in Firebase Auth settings
- Ensure localhost is in authorized domains for development

**Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check TypeScript errors in terminal
- Verify all imports are correct

---

## 📞 Need Help?

- **Firebase Docs**: [firebase.google.com/docs](https://firebase.google.com/docs)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Tailwind Docs**: [tailwindcss.com/docs](https://tailwindcss.com/docs)

---

**Happy Coding! 🚀**

> Remember: Start simple, iterate fast, and focus on getting the core functionality working first!