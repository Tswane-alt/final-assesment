import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Sign up a new user with email and password
 * Creates user auth account and user profile document in Firestore
 */
export const signUpUser = async (email, password, displayName) => {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update user profile with display name
    await updateProfile(user, {
      displayName: displayName,
    });

    // Create user profile document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email: email,
      displayName: displayName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // Store user token for persistence
    await AsyncStorage.setItem('userToken', user.uid);
    
    // Mark that user has completed onboarding
    await AsyncStorage.setItem('hasSeenOnboarding', 'true');

    return {
      success: true,
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    };
  } catch (error) {
    console.error('Sign up error:', error);
    
    let errorMessage = 'Failed to create account';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'This email is already registered';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password should be at least 6 characters';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection';
        break;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Sign in existing user with email and password
 */
export const signInUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    let userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };

    if (userDoc.exists()) {
      userData = { ...userData, ...userDoc.data() };
    }

    // Store user token for persistence
    await AsyncStorage.setItem('userToken', user.uid);

    return {
      success: true,
      user: userData,
    };
  } catch (error) {
    console.error('Sign in error:', error);
    
    let errorMessage = 'Failed to sign in';
    
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Invalid email or password';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many attempts. Please try again later';
        break;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
    await AsyncStorage.removeItem('userToken');
    return {
      success: true,
    };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: 'Failed to sign out',
    };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return {
      success: true,
      message: 'Password reset email sent. Please check your inbox.',
    };
  } catch (error) {
    console.error('Password reset error:', error);
    
    let errorMessage = 'Failed to send reset email';
    
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your connection';
        break;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, updates) => {
  try {
    const user = auth.currentUser;
    
    if (!user) {
      throw new Error('No user is currently signed in');
    }

    // Update auth profile if display name changed
    if (updates.displayName) {
      await updateProfile(user, {
        displayName: updates.displayName,
      });
    }

    // Update Firestore document
    await updateDoc(doc(db, 'users', userId), {
      ...updates,
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    console.error('Update profile error:', error);
    return {
      success: false,
      error: 'Failed to update profile',
    };
  }
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // User is signed in
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        let userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        };

        if (userDoc.exists()) {
          userData = { ...userData, ...userDoc.data() };
        }

        callback(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      }
    } else {
      // User is signed out
      callback(null);
    }
  });
};

/**
 * Get current user from AsyncStorage
 */
export const getCurrentUser = async () => {
  try {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken && auth.currentUser) {
      const userDoc = await getDoc(doc(db, 'users', userToken));
      if (userDoc.exists()) {
        return userDoc.data();
      }
    }
    return null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
};