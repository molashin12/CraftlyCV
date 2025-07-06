'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '@/types';
import { calculateCompletionPercentage } from '@/utils/profileCompletion';

// Dynamic imports for Firebase to avoid SSR issues
let auth: any = null;
let db: any = null;
let COLLECTIONS: any = null;
let firebaseAuth: any = null;
let firebaseFirestore: any = null;

// Initialize Firebase only on client side
const initializeFirebase = async () => {
  if (typeof window !== 'undefined' && !auth) {
    const { auth: firebaseAuthInstance, db: firebaseDbInstance, COLLECTIONS: collectionsInstance } = await import('@/lib/firebase');
    const authModule = await import('firebase/auth');
    const firestoreModule = await import('firebase/firestore');
    
    auth = firebaseAuthInstance;
    db = firebaseDbInstance;
    COLLECTIONS = collectionsInstance;
    firebaseAuth = authModule;
    firebaseFirestore = firestoreModule;
  }
};

// ============================================================================
// TYPES
// ============================================================================

interface AuthContextType {
  user: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<any>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string, additionalInfo?: { firstName: string; lastName: string }) => Promise<any>;
  signOut: () => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// ============================================================================
// CUSTOM HOOK
// ============================================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firebaseInitialized, setFirebaseInitialized] = useState(false);

  // Initialize Firebase on component mount
  useEffect(() => {
    const init = async () => {
      await initializeFirebase();
      setFirebaseInitialized(true);
    };
    init();
  }, []);

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const createInitialProfile = (user: any): UserProfile => {
    const [firstName = '', lastName = ''] = (user.displayName || '').split(' ');
    
    const profile: UserProfile = {
      id: user.uid,
      personalInfo: {
        firstName,
        lastName,
        email: user.email || '',
        phone: user.phoneNumber ? String(user.phoneNumber) : '',
        location: {
          city: '',
          country: ''
        },
        linkedinUrl: '',
        portfolioUrl: ''
      },
      summary: {
        headline: '',
        description: ''
      },
      experience: [],
      education: [],
      skills: {
        technical: [],
        soft: [],
        languages: []
      },
      metadata: {
        completionPercentage: 0, // Will be calculated below
        lastUpdated: firebaseFirestore?.Timestamp?.now() || new Date(),
        version: 1
      }
    };
    
    // Calculate initial completion percentage
    profile.metadata.completionPercentage = calculateCompletionPercentage(profile);
    
    return profile;
  };

  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      if (!db || !COLLECTIONS || !firebaseFirestore) {
        throw new Error('Firebase not initialized');
      }
      const { getDoc, doc } = firebaseFirestore;
      const userDoc = await getDoc(doc(db, COLLECTIONS.users, userId));
      
      if (userDoc.exists()) {
        return { id: userId, ...userDoc.data() } as UserProfile;
      }
      
      return null;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to fetch user profile');
      return null;
    }
  };

  const saveUserProfile = async (profile: UserProfile): Promise<void> => {
    try {
      if (!db || !COLLECTIONS || !firebaseFirestore) {
        throw new Error('Firebase not initialized');
      }
      
      const { id, ...profileData } = profile;
      const { setDoc, doc, Timestamp } = firebaseFirestore;
      await setDoc(doc(db, COLLECTIONS.users, id), {
        ...profileData,
        metadata: {
          ...profileData.metadata,
          lastUpdated: Timestamp.now()
        }
      });
    } catch (err) {
      console.error('Error saving user profile:', err);
      throw new Error('Failed to save user profile');
    }
  };

  // ============================================================================
  // AUTH FUNCTIONS
  // ============================================================================

  const signInWithGoogle = async (): Promise<any> => {
    try {
      if (!auth || !firebaseAuth) {
        throw new Error('Firebase not initialized');
      }
      
      setError(null);
      setLoading(true);
      
      const provider = new firebaseAuth.GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const result = await firebaseAuth.signInWithPopup(auth, provider);
      
      // Check if user profile exists, create if not
      let profile = await fetchUserProfile(result.user.uid);
      
      if (!profile) {
        profile = createInitialProfile(result.user);
        await saveUserProfile(profile);
      }
      
      setUserProfile(profile);
      return result;
    } catch (err: any) {
      console.error('Error signing in with Google:', err);
      setError(err.message || 'Failed to sign in with Google');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<any> => {
    try {
      if (!auth || !firebaseAuth) {
        throw new Error('Firebase not initialized');
      }
      
      setError(null);
      setLoading(true);
      
      const result = await firebaseAuth.signInWithEmailAndPassword(auth, email, password);
      
      // Fetch user profile
      const profile = await fetchUserProfile(result.user.uid);
      setUserProfile(profile);
      
      return result;
    } catch (err: any) {
      console.error('Error signing in with email:', err);
      setError(err.message || 'Failed to sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, additionalInfo?: { firstName: string; lastName: string }): Promise<any> => {
    try {
      if (!auth || !firebaseAuth) {
        throw new Error('Firebase not initialized');
      }
      
      setError(null);
      setLoading(true);
      
      const result = await firebaseAuth.createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name if additional info provided
      if (additionalInfo && (additionalInfo.firstName || additionalInfo.lastName)) {
        const displayName = `${additionalInfo.firstName} ${additionalInfo.lastName}`.trim();
        await firebaseAuth.updateProfile(result.user, { displayName });
      }
      
      // Create initial profile
      const profile = createInitialProfile({
        ...result.user,
        displayName: additionalInfo ? `${additionalInfo.firstName} ${additionalInfo.lastName}`.trim() : result.user.displayName
      });
      
      await saveUserProfile(profile);
      setUserProfile(profile);
      
      return result;
    } catch (err: any) {
      console.error('Error signing up with email:', err);
      setError(err.message || 'Failed to create account');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      if (!auth || !firebaseAuth) {
        throw new Error('Firebase not initialized');
      }
      
      setError(null);
      await firebaseAuth.signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (err: any) {
      console.error('Error signing out:', err);
      setError(err.message || 'Failed to sign out');
      throw err;
    }
  };

  const updateUserProfile = async (profileUpdates: Partial<UserProfile>): Promise<void> => {
    if (!user) {
      throw new Error('No user logged in');
    }

    if (!firebaseFirestore) {
      throw new Error('Firebase not initialized');
    }

    try {
      setError(null);
      
      // If no existing profile, create a new one
      let baseProfile: UserProfile;
      if (userProfile) {
        baseProfile = userProfile;
      } else {
        // Create initial profile structure
        baseProfile = createInitialProfile(user);
      }
      
      // Deep merge personalInfo to avoid overwriting existing fields with undefined
      const mergedPersonalInfo = profileUpdates.personalInfo ? {
        ...baseProfile.personalInfo,
        ...Object.fromEntries(
          Object.entries(profileUpdates.personalInfo).filter(([_, value]) => value !== undefined)
        )
      } : baseProfile.personalInfo;

      const updatedProfile: UserProfile = {
        ...baseProfile,
        ...profileUpdates,
        personalInfo: mergedPersonalInfo,
        id: user.uid, // Ensure ID is set
        metadata: {
          ...baseProfile.metadata,
          ...profileUpdates.metadata,
          completionPercentage: calculateCompletionPercentage({
            ...baseProfile,
            ...profileUpdates,
            personalInfo: mergedPersonalInfo
          }),
          lastUpdated: firebaseFirestore.Timestamp?.now() || new Date(),
          version: (baseProfile.metadata?.version || 0) + 1
        }
      };

      await saveUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
    } catch (err: any) {
      console.error('Error updating user profile:', err);
      setError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const refreshUserProfile = async (): Promise<void> => {
    if (!user) return;

    try {
      setError(null);
      const profile = await fetchUserProfile(user.uid);
      setUserProfile(profile);
    } catch (err: any) {
      console.error('Error refreshing user profile:', err);
      setError(err.message || 'Failed to refresh profile');
    }
  };

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (!firebaseInitialized || !auth || !firebaseAuth) {
      return;
    }

    const unsubscribe = firebaseAuth.onAuthStateChanged(auth, async (user: any) => {
      try {
        setLoading(true);
        setError(null);
        
        if (user) {
          setUser(user);
          
          // Fetch or create user profile
          let profile = await fetchUserProfile(user.uid);
          
          if (!profile) {
            // Create initial profile for new users
            profile = createInitialProfile(user);
            await saveUserProfile(profile);
          }
          
          setUserProfile(profile);
        } else {
          setUser(null);
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [firebaseInitialized]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    updateUserProfile,
    refreshUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;