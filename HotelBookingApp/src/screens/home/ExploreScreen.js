import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HOTELS_DATA = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    location: 'New York, USA',
    rating: 4.8,
    price: 250,
    image: require('../../assets/images/hotels/hotel1.jpg'),
    description: 'Luxury hotel in the heart of Manhattan',
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
  },
  {
    id: '2',
    name: 'Oceanview Resort',
    location: 'Miami, USA',
    rating: 4.5,
    price: 180,
    image: require('../../assets/images/hotels/hotel2.jpg'),
    description: 'Beachfront resort with stunning ocean views',
    amenities: ['Beach Access', 'WiFi', 'Pool', 'Bar'],
  },
  {
    id: '3',
    name: 'Mountain Lodge',
    location: 'Aspen, USA',
    rating: 4.9,
    price: 320,
    image: require('../../assets/images/hotels/hotel3.jpg'),
    description: 'Cozy lodge with mountain views',
    amenities: ['Fireplace', 'Spa', 'Restaurant', 'WiFi'],
  },
  {
    id: '4',
    name: 'City Center Inn',
    location: 'Los Angeles, USA',
    rating: 4.3,
    price: 150,
    image: require('../../assets/images/hotels/hotel1.jpg'),
    description: 'Budget-friendly hotel in downtown LA',
    amenities: ['WiFi', 'Parking', 'Breakfast'],
  },
  {
    id: '5',
    name: 'Sunset Paradise',
    location: 'San Diego, USA',
    rating: 4.7,
    price: 200,
    image: require('../../assets/images/hotels/hotel2.jpg'),
    description: 'Beautiful resort near the beach',
    amenities: ['Pool', 'WiFi', 'Spa', 'Restaurant'],
  },
];

const ExploreScreen = ({ navigation }) => {
  const [hotels, setHotels] = useState([]);
  const [filteredHotels, setFilteredHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('none');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadHotels();
  }, []);

  useEffect(() => {
    filterAndSortHotels();
  }, [sortBy, searchQuery, hotels]);

  const loadHotels = () => {
    setTimeout(() => {
      setHotels(HOTELS_DATA);
      setFilteredHotels(HOTELS_DATA);
      setLoading(false);
    }, 1000);
  };

  const filterAndSortHotels = () => {
    let filtered = [...hotels];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          hotel.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'price_low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    setFilteredHotels(filtered);
  };

  const handleHotelPress = (hotel) => {
    navigation.navigate('HotelDetails', { hotel });
  };

  const renderHotelCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleHotelPress(item)}
      activeOpacity={0.7}
    >
      <Image source={item.image} style={styles.hotelImage} />
      <View style={styles.cardContent}>
        <Text style={styles.hotelName}>{item.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <View style={styles.ratingPriceContainer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
          <Text style={styles.price}>${item.price}/night</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={64} color="#ccc" />
      <Text style={styles.emptyText}>No hotels found</Text>
      <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading hotels...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search hotels or locations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortButtons}>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'none' && styles.activeSortButton]}
            onPress={() => setSortBy('none')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'none' && styles.activeSortText]}>
              Default
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'price_low' && styles.activeSortButton]}
            onPress={() => setSortBy('price_low')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'price_low' && styles.activeSortText]}>
              Price ↑
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'price_high' && styles.activeSortButton]}
            onPress={() => setSortBy('price_high')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'price_high' && styles.activeSortText]}>
              Price ↓
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortButton, sortBy === 'rating' && styles.activeSortButton]}
            onPress={() => setSortBy('rating')}
          >
            <Text style={[styles.sortButtonText, sortBy === 'rating' && styles.activeSortText]}>
              Rating
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hotels List */}
      <FlatList
        data={filteredHotels}
        renderItem={renderHotelCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  sortContainer: {
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  sortLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  activeSortButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#666',
  },
  activeSortText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContent: {
    padding: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  hotelImage: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 15,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  ratingPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 4,
    color: '#1a1a1a',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 15,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
});

export default ExploreScreen;