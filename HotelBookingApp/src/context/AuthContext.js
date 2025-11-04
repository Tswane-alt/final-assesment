import React, { createContext, useState, useEffect } from 'react';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import {
  signUpUser,
  signInUser,
  signOutUser,
  resetPassword,
  updateUserProfile as updateProfile,
  onAuthStateChange,
} from '../services/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
      setInitializing(false);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Load user bookings when user changes
  useEffect(() => {
    if (user) {
      loadUserBookings(user.uid);
    } else {
      setBookings([]);
    }
  }, [user]);

  /**
   * Sign up new user
   */
  const signUp = async (email, password, displayName) => {
    setLoading(true);
    try {
      const result = await signUpUser(email, password, displayName);
      if (result.success) {
        setUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in user
   */
  const signIn = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInUser(email, password);
      if (result.success) {
        setUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    setLoading(true);
    try {
      const result = await signOutUser();
      if (result.success) {
        setUser(null);
        setBookings([]);
      }
      return result;
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Reset password
   */
  const forgotPassword = async (email) => {
    return await resetPassword(email);
  };

  /**
   * Update user profile
   */
  const updateUserProfile = async (updates) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const result = await updateProfile(user.uid, updates);
      if (result.success) {
        setUser({ ...user, ...updates });
      }
      return result;
    } catch (error) {
      console.error('Update profile error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Load user bookings from Firestore
   */
  const loadUserBookings = async (userId) => {
    try {
      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('userId', '==', userId));
      
      // Real-time listener
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const bookingsData = [];
        snapshot.forEach((doc) => {
          bookingsData.push({ id: doc.id, ...doc.data() });
        });
        setBookings(bookingsData);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Load bookings error:', error);
      return null;
    }
  };

  /**
   * Add new booking
   */
  const addBooking = async (booking) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const bookingData = {
        ...booking,
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      
      // Also store in a subcollection under the user
      await setDoc(doc(db, 'users', user.uid, 'bookings', docRef.id), bookingData);

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Add booking error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Update booking
   */
  const updateBooking = async (bookingId, updates) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(doc(db, 'bookings', bookingId), updateData);
      await updateDoc(doc(db, 'users', user.uid, 'bookings', bookingId), updateData);

      return { success: true };
    } catch (error) {
      console.error('Update booking error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Delete booking
   */
  const deleteBooking = async (bookingId) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      await deleteDoc(doc(db, 'bookings', bookingId));
      await deleteDoc(doc(db, 'users', user.uid, 'bookings', bookingId));

      return { success: true };
    } catch (error) {
      console.error('Delete booking error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Add review for a hotel
   */
  const addReview = async (hotelId, review) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const reviewData = {
        ...review,
        userId: user.uid,
        userName: user.displayName || user.email,
        hotelId: hotelId,
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(
        collection(db, 'hotels', hotelId, 'reviews'),
        reviewData
      );

      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Add review error:', error);
      return { success: false, error: error.message };
    }
  };

  /**
   * Get reviews for a hotel
   */
  const getHotelReviews = async (hotelId) => {
    try {
      const reviewsRef = collection(db, 'hotels', hotelId, 'reviews');
      const snapshot = await getDocs(reviewsRef);
      
      const reviews = [];
      snapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() });
      });

      return { success: true, data: reviews };
    } catch (error) {
      console.error('Get reviews error:', error);
      return { success: false, error: error.message, data: [] };
    }
  };

  const value = {
    user,
    bookings,
    loading,
    initializing,
    signUp,
    signIn,
    logout,
    forgotPassword,
    updateUserProfile,
    addBooking,
    updateBooking,
    deleteBooking,
    addReview,
    getHotelReviews,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};