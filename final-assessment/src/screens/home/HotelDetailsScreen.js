// src/screens/home/HotelDetailsScreen.js
// ===================================
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { validateReview } from '../../utils/validation';
import { fetchWeather } from '../../services/api';
import colors from '../../constants/colors';

const HotelDetailsScreen = ({ route, navigation }) => {
  const { hotel } = route.params;
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    fetchHotelWeather();
  }, []);

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, 'reviews'), where('hotelId', '==', hotel.id));
      const querySnapshot = await getDocs(q);
      const reviewsData = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() });
      });
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchHotelWeather = async () => {
    setWeatherLoading(true);
    const result = await fetchWeather(hotel.latitude, hotel.longitude);
    if (result.success) {
      setWeather(result.data);
    }
    setWeatherLoading(false);
  };

  const handleAddReview = async () => {
    const validation = validateReview(rating, comment);
    if (!validation.isValid) {
      Alert.alert('Error', validation.error);
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'reviews'), {
        hotelId: hotel.id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        rating,
        comment: comment.trim(),
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Review added successfully!');
      setComment('');
      setRating(0);
      setShowReviewForm(false);
      fetchReviews();
    } catch (error) {
      Alert.alert('Error', 'Failed to add review');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (count) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => showReviewForm && setRating(i)}
          disabled={!showReviewForm}
        >
          <Ionicons
            name={i <= count ? 'star' : 'star-outline'}
            size={24}
            color={colors.star}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: hotel.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.name}>{hotel.name}</Text>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location" size={20} color={colors.textSecondary} />
          <Text style={styles.location}>{hotel.location}</Text>
        </View>

        <View style={styles.ratingContainer}>
          <View style={styles.stars}>{renderStars(hotel.rating)}</View>
          <Text style={styles.rating}>{hotel.rating}</Text>
        </View>

        <Text style={styles.price}>${hotel.pricePerNight} per night</Text>

        {weather && (
          <View style={styles.weatherContainer}>
            <Text style={styles.sectionTitle}>Current Weather</Text>
            {weatherLoading ? (
              <ActivityIndicator />
            ) : (
              <View style={styles.weatherInfo}>
                <Text style={styles.weatherText}>🌡️ {weather.temp}°C</Text>
                <Text style={styles.weatherText}>💧 {weather.humidity}%</Text>
                <Text style={styles.weatherText}>💨 {weather.windSpeed} m/s</Text>
                <Text style={styles.weatherDesc}>{weather.description}</Text>
              </View>
            )}
          </View>
        )}

        <Text style={styles.description}>{hotel.description}</Text>

        <View style={styles.amenitiesContainer}>
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesList}>
            {hotel.amenities.map((amenity, index) => (
              <View key={index} style={styles.amenityItem}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('Booking', { hotel })}
        >
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>

        <View style={styles.reviewsSection}>
          <Text style={styles.sectionTitle}>Reviews ({reviews.length})</Text>
          
          {!showReviewForm && (
            <TouchableOpacity
              style={styles.addReviewButton}
              onPress={() => setShowReviewForm(true)}
            >
              <Text style={styles.addReviewText}>Add Review</Text>
            </TouchableOpacity>
          )}

          {showReviewForm && (
            <View style={styles.reviewForm}>
              <Text style={styles.label}>Your Rating</Text>
              <View style={styles.ratingInput}>{renderStars(rating)}</View>
              
              <Text style={styles.label}>Your Review</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Share your experience..."
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              
              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {
                    setShowReviewForm(false);
                    setRating(0);
                    setComment('');
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={handleAddReview}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet. Be the first!</Text>
          ) : (
            reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewerName}>{review.userName}</Text>
                  <View style={styles.reviewStars}>{renderStars(review.rating)}</View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  location: {
    fontSize: 16,
    color: colors.textSecondary,
    marginLeft: 5,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 10,
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 20,
  },
  weatherContainer: {
    backgroundColor: colors.lightGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  weatherInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  weatherText: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  weatherDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  amenitiesContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 10,
  },
  amenityText: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 5,
  },
  bookButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  bookButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsSection: {
    marginBottom: 20,
  },
  addReviewButton: {
    backgroundColor: colors.secondary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  addReviewText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  reviewForm: {
    backgroundColor: colors.lightGray,
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  ratingInput: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: colors.white,
    marginBottom: 15,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 10,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  noReviews: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginVertical: 20,
  },
  reviewCard: {
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  reviewStars: {
    flexDirection: 'row',
  },
  reviewComment: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default HotelDetailsScreen;