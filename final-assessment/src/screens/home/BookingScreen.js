// src/screens/home/BookingScreen.js
// ===================================
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../../context/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { validateBookingDates, validateRooms } from '../../utils/validation';
import { calculateTotalCost, formatDate, formatCurrency, generateBookingId } from '../../utils/helpers';
import colors from '../../constants/colors';

const BookingScreen = ({ route, navigation }) => {
  const { hotel } = route.params;
  const { user } = useAuth();
  
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000));
  const [rooms, setRooms] = useState(1);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const bookingInfo = calculateTotalCost(
    hotel.pricePerNight,
    checkIn,
    checkOut,
    rooms
  );

  const handleBooking = async () => {
    const dateValidation = validateBookingDates(checkIn, checkOut);
    const roomsValidation = validateRooms(rooms);

    if (!dateValidation.isValid) {
      Alert.alert('Error', dateValidation.error);
      return;
    }

    if (!roomsValidation.isValid) {
      Alert.alert('Error', roomsValidation.error);
      return;
    }

    Alert.alert(
      'Confirm Booking',
      `Book ${rooms} room(s) for ${bookingInfo.numberOfNights} night(s)?\nTotal: ${formatCurrency(bookingInfo.totalCost)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: confirmBooking },
      ]
    );
  };

  const confirmBooking = async () => {
    setLoading(true);

    try {
      const bookingId = generateBookingId();
      
      await addDoc(collection(db, 'bookings'), {
        bookingId,
        userId: user.uid,
        hotelId: hotel.id,
        hotelName: hotel.name,
        hotelImage: hotel.image,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        rooms,
        pricePerNight: hotel.pricePerNight,
        totalCost: bookingInfo.totalCost,
        numberOfNights: bookingInfo.numberOfNights,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
      });

      Alert.alert(
        'Booking Confirmed!',
        `Your booking (${bookingId}) has been confirmed.`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ExploreHome'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.hotelCard}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.hotelLocation}>{hotel.location}</Text>
          <Text style={styles.pricePerNight}>
            ${hotel.pricePerNight} per night
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check-in Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCheckInPicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(checkIn)}</Text>
          </TouchableOpacity>
          {showCheckInPicker && (
            <DateTimePicker
              value={checkIn}
              mode="date"
              minimumDate={new Date()}
              onChange={(event, date) => {
                setShowCheckInPicker(Platform.OS === 'ios');
                if (date) setCheckIn(date);
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check-out Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCheckOutPicker(true)}
          >
            <Text style={styles.dateText}>{formatDate(checkOut)}</Text>
          </TouchableOpacity>
          {showCheckOutPicker && (
            <DateTimePicker
              value={checkOut}
              mode="date"
              minimumDate={new Date(checkIn.getTime() + 86400000)}
              onChange={(event, date) => {
                setShowCheckOutPicker(Platform.OS === 'ios');
                if (date) setCheckOut(date);
              }}
            />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Number of Rooms</Text>
          <View style={styles.roomsContainer}>
            <TouchableOpacity
              style={styles.roomButton}
              onPress={() => setRooms(Math.max(1, rooms - 1))}
            >
              <Text style={styles.roomButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.roomsText}>{rooms}</Text>
            <TouchableOpacity
              style={styles.roomButton}
              onPress={() => setRooms(Math.min(10, rooms + 1))}
            >
              <Text style={styles.roomButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Booking Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Nights:</Text>
            <Text style={styles.summaryValue}>{bookingInfo.numberOfNights}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rooms:</Text>
            <Text style={styles.summaryValue}>{rooms}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Price per night:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(hotel.pricePerNight)}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalValue}>
              {formatCurrency(bookingInfo.totalCost)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.buttonDisabled]}
          onPress={handleBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.confirmButtonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
  },
  hotelCard: {
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  hotelLocation: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  pricePerNight: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  dateButton: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateText: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  roomsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  roomButton: {
    backgroundColor: colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomButtonText: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  roomsText: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: colors.lightGray,
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookingScreen;