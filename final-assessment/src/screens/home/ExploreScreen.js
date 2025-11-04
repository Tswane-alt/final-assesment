// src/screens/home/ExploreScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SAMPLE_HOTELS } from '../../constants/data';
import { sortHotels } from '../../utils/helpers';
import colors from '../../constants/colors';

const ExploreScreen = ({ navigation }) => {
  const [hotels, setHotels] = useState(SAMPLE_HOTELS);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    const sorted = sortHotels(SAMPLE_HOTELS, sortBy);
    setHotels(sorted);
  }, [sortBy]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={14} color={colors.star} />);
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={14} color={colors.star} />);
    }

    return stars;
  };

  const renderHotel = ({ item }) => (
    <TouchableOpacity
      style={styles.hotelCard}
      onPress={() => navigation.navigate('HotelDetails', { hotel: item })}
    >
      <Image source={{ uri: item.image }} style={styles.hotelImage} />
      <View style={styles.hotelInfo}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <View style={styles.stars}>{renderStars(item.rating)}</View>
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.price}>${item.pricePerNight} / night</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.filterButton, sortBy === 'default' && styles.filterButtonActive]}
          onPress={() => setSortBy('default')}
        >
          <Text style={[styles.filterText, sortBy === 'default' && styles.filterTextActive]}>
            Default
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, sortBy === 'price-low' && styles.filterButtonActive]}
          onPress={() => setSortBy('price-low')}
        >
          <Text style={[styles.filterText, sortBy === 'price-low' && styles.filterTextActive]}>
            Price: Low
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, sortBy === 'rating' && styles.filterButtonActive]}
          onPress={() => setSortBy('rating')}
        >
          <Text style={[styles.filterText, sortBy === 'rating' && styles.filterTextActive]}>
            Rating
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={hotels}
          renderItem={renderHotel}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    marginRight: 10,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    backgroundColor: colors.lightGray,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
  },
  hotelCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hotelImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  hotelInfo: {
    padding: 15,
  },
  hotelName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 5,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExploreScreen;