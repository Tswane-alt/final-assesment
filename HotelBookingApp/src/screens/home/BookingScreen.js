import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AuthContext } from '../../context/AuthContext';

const BookingScreen = ({ route, navigation }) => {
  const { hotel } = route.params;
  const { user, addBooking } = useContext(AuthContext);
  
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000)
  );
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [showCheckInPicker, setShowCheckInPicker] = useState(false);
  const [showCheckOutPicker, setShowCheckOutPicker] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [errors, setErrors] = useState({});

  const validateBooking = () => {
    const newErrors = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      newErrors.checkIn = 'Check-in date cannot be in the past';
    }

    if (checkOutDate <= checkInDate) {
      newErrors.checkOut = 'Check-out date must be after check-in date';
    }

    if (numberOfRooms < 1) {
      newErrors.rooms = 'At least 1 room is required';
    }

    if (numberOfGuests < 1) {
      newErrors.guests = 'At least 1 guest is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateNights = () => {
    const diffTime = Math.abs(checkOutDate - checkInDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalCost = () => {
    const nights = calculateNights();
    return nights * hotel.price * numberOfRooms;
  };

  const handleCheckInChange = (event, selectedDate) => {
    setShowCheckInPicker(false);
    if (selectedDate) {
      setCheckInDate(selectedDate);
      // Auto-adjust checkout if it's before new checkin
      if (selectedDate >= checkOutDate) {
        const newCheckOut = new Date(selectedDate);
        newCheckOut.setDate(newCheckOut.getDate() + 1);
        setCheckOutDate(newCheckOut);
      }
    }
  };

  const handleCheckOutChange = (event, selectedDate) => {
    setShowCheckOutPicker(false);
    if (selectedDate) {
      setCheckOutDate(selectedDate);
    }
  };

  const handleContinue = () => {
    if (validateBooking()) {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmBooking = async () => {
    const booking = {
      id: Date.now().toString(),
      hotelId: hotel.id,
      hotelName: hotel.name,
      hotelImage: hotel.image,
      location: hotel.location,
      checkIn: checkInDate.toISOString().split('T')[0],
      checkOut: checkOutDate.toISOString().split('T')[0],
      rooms: numberOfRooms,
      guests: numberOfGuests,
      totalCost: calculateTotalCost(),
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'confirmed',
    };

    // Add to context (and later Firebase)
    if (addBooking) {
      await addBooking(booking);
    }

    setShowConfirmModal(false);
    
    Alert.alert(
      'Booking Confirmed!',
      'Your booking has been successfully confirmed. You can view it in your profile.',
      [
        {
          text: 'View Bookings',
          onPress: () => navigation.navigate('Profile'),
        },
        {
          text: 'OK',
          onPress: () => navigation.navigate('Explore'),
        },
      ]
    );
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hotel Summary */}
        <View style={styles.hotelSummary}>
          <Image source={hotel.image} style={styles.hotelImage} />
          <View style={styles.hotelInfo}>
            <Text style={styles.hotelName}>{hotel.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.location}>{hotel.location}</Text>
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={styles.rating}>{hotel.rating}</Text>
            </View>
          </View>
        </View>

        {/* Booking Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Booking Details</Text>

          {/* Check-in Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Check-in Date</Text>
            <TouchableOpacity
              style={[styles.dateButton, errors.checkIn && styles.errorInput]}
              onPress={() => setShowCheckInPicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#007AFF" />
              <Text style={styles.dateText}>{formatDate(checkInDate)}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {errors.checkIn && <Text style={styles.errorText}>{errors.checkIn}</Text>}
          </View>

          {/* Check-out Date */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Check-out Date</Text>
            <TouchableOpacity
              style={[styles.dateButton, errors.checkOut && styles.errorInput]}
              onPress={() => setShowCheckOutPicker(true)}
            >
              <Ionicons name="calendar-outline" size={20} color="#007AFF" />
              <Text style={styles.dateText}>{formatDate(checkOutDate)}</Text>
              <Ionicons name="chevron-down" size={20} color="#666" />
            </TouchableOpacity>
            {errors.checkOut && <Text style={styles.errorText}>{errors.checkOut}</Text>}
          </View>

          {/* Number of Rooms */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of Rooms</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setNumberOfRooms(Math.max(1, numberOfRooms - 1))}
              >
                <Ionicons name="remove" size={24} color="#007AFF" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{numberOfRooms}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setNumberOfRooms(numberOfRooms + 1)}
              >
                <Ionicons name="add" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
            {errors.rooms && <Text style={styles.errorText}>{errors.rooms}</Text>}
          </View>

          {/* Number of Guests */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Number of Guests</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setNumberOfGuests(Math.max(1, numberOfGuests - 1))}
              >
                <Ionicons name="remove" size={24} color="#007AFF" />
              </TouchableOpacity>
              <Text style={styles.counterValue}>{numberOfGuests}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setNumberOfGuests(numberOfGuests + 1)}
              >
                <Ionicons name="add" size={24} color="#007AFF" />
              </TouchableOpacity>
            </View>
            {errors.guests && <Text style={styles.errorText}>{errors.guests}</Text>}
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Breakdown</Text>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              ${hotel.price} × {calculateNights()} nights × {numberOfRooms} room(s)
            </Text>
            <Text style={styles.priceValue}>${calculateTotalCost()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${calculateTotalCost()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {showCheckInPicker && (
        <DateTimePicker
          value={checkInDate}
          mode="date"
          display="default"
          onChange={handleCheckInChange}
          minimumDate={new Date()}
        />
      )}

      {showCheckOutPicker && (
        <DateTimePicker
          value={checkOutDate}
          mode="date"
          display="default"
          onChange={handleCheckOutChange}
          minimumDate={new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)}
        />
      )}

      {/* Continue Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
          <Text style={styles.continueButtonText}>Continue to Confirm</Text>
        </TouchableOpacity>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Confirm Booking</Text>
              <TouchableOpacity onPress={() => setShowConfirmModal(false)}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalScroll}>
              <View style={styles.confirmSection}>
                <Text style={styles.confirmLabel}>Hotel</Text>
                <Text style={styles.confirmValue}>{hotel.name}</Text>
              </View>

              <View style={styles.confirmSection}>
                <Text style={styles.confirmLabel}>Location</Text>
                <Text style={styles.confirmValue}>{hotel.location}</Text>
              </View>

              <View style={styles.confirmSection}>
                <Text style={styles.confirmLabel}>Check-in</Text>
                <Text style={styles.confirmValue}>{formatDate(checkInDate)}</Text>
              </View>

              <View style={styles.confirmSection}>
                <Text style={styles.confirmLabel}>Check-out</Text>
                <Text style={styles.confirmValue}>{formatDate(checkOutDate)}</Text>
              </View>

              <View style={styles.confirmSection}>
                <Text style={styles.confirmLabel}>Duration</Text>
                <Text style={styles.confirmValue}>{calculateNights()} night(s)</Text>
              </View>

              <View style={styles.confirmSection}>
                <Text style={styles.confirmLabel}>Rooms</Text>
                <Text style={styles.confirmValue}>{numberOfRooms}</Text>
              </View>

              <View style={styles.confirmSection}>
                <Text style={styles.confirmLabel}>Guests</Text>
                <Text style={styles.confirmValue}>{numberOfGuests}</Text>
              </View>

              <View style={[styles.confirmSection, styles.totalSection]}>
                <Text style={styles.confirmTotalLabel}>Total Amount</Text>
                <Text style={styles.confirmTotalValue}>${calculateTotalCost()}</Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmBooking}
            >
              <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  hotelSummary: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 15,
    marginBottom: 10,
  },
  hotelImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  hotelInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 5,
    color: '#1a1a1a',
  },
  section: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
    marginLeft: 10,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  counterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  counterValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginHorizontal: 30,
  },
  errorInput: {
    borderColor: '#ff3b30',
  },
  errorText: {
    fontSize: 12,
    color: '#ff3b30',
    marginTop: 5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  priceLabel: {
    fontSize: 14,
    color: '#666',
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalScroll: {
    maxHeight: 400,
  },
  confirmSection: {
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  confirmLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  confirmValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  totalSection: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 12,
    borderBottomWidth: 0,
  },
  confirmTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  confirmTotalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default BookingScreen;