// src/screens/profile/ProfileScreen.js
// ===================================
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { db, auth } from '../../services/firebase';
import { validateName } from '../../utils/validation';
import { formatDate, formatCurrency } from '../../utils/helpers';
import colors from '../../constants/colors';

const ProfileScreen = () => {
  const { user, userData, signOut, refreshUserData } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.displayName || '');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const bookingsData = [];
      querySnapshot.forEach((doc) => {
        bookingsData.push({ id: doc.id, ...doc.data() });
      });
      setBookings(bookingsData.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      ));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    const validation = validateName(name);
    if (!validation.isValid) {
      Alert.alert('Error', validation.error);
      return;
    }

    setUpdating(true);

    try {
      await updateProfile(auth.currentUser, { displayName: name });
      
      await updateDoc(doc(db, 'users', user.uid), {
        name: name,
        updatedAt: new Date().toISOString(),
      });

      await refreshUserData();
      setEditMode(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      console.error(error);
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', onPress: signOut, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color={colors.primary} />
        </View>
        
        {editMode ? (
          <View style={styles.editContainer}>
            <TextInput
              style={styles.nameInput}
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
            />
            <View style={styles.editButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setEditMode(false);
                  setName(user?.displayName || '');
                }}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleUpdateProfile}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color={colors.white} size="small" />
                ) : (
                  <Text style={styles.saveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <Text style={styles.name}>{user?.displayName || 'User'}</Text>
            <Text style={styles.email}>{user?.email}</Text>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => setEditMode(true)}
            >
              <Ionicons name="create-outline" size={16} color={colors.primary} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Bookings</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
        ) : bookings.length === 0 ? (
          <Text style={styles.noBookings}>No bookings yet</Text>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              {booking.hotelImage && (
                <Image
                  source={{ uri: booking.hotelImage }}
                  style={styles.bookingImage}
                />
              )}
              <View style={styles.bookingInfo}>
                <Text style={styles.bookingHotel}>{booking.hotelName}</Text>
                <Text style={styles.bookingId}>ID: {booking.bookingId}</Text>
                <Text style={styles.bookingDates}>
                  {formatDate(new Date(booking.checkIn))} - {formatDate(new Date(booking.checkOut))}
                </Text>
                <Text style={styles.bookingDetails}>
                  {booking.rooms} room(s) • {booking.numberOfNights} night(s)
                </Text>
                <Text style={styles.bookingTotal}>
                  Total: {formatCurrency(booking.totalCost)}
                </Text>
                <View style={[styles.statusBadge, styles.statusConfirmed]}>
                  <Text style={styles.statusText}>{booking.status}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editProfileText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
  },
  editContainer: {
    width: '100%',
  },
  nameInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  saveText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  loader: {
    marginVertical: 20,
  },
  noBookings: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  bookingCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  bookingImage: {
    width: '100%',
    height: 150,
  },
  bookingInfo: {
    padding: 15,
  },
  bookingHotel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  bookingId: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  bookingDates: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 5,
  },
  bookingDetails: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  bookingTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  statusConfirmed: {
    backgroundColor: colors.success + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.success,
    textTransform: 'capitalize',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  signOutText: {
    color: colors.danger,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;