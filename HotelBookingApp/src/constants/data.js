// Sample hotel data for the app
export const SAMPLE_HOTELS = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    location: 'New York, USA',
    rating: 4.8,
    price: 250,
    image: require('../../assets/images/hotels/hotel1.jpg'),
    description: 'Experience luxury in the heart of Manhattan with stunning city views, world-class amenities, and exceptional service. Our hotel features modern rooms, a rooftop pool, and fine dining restaurants.',
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Room Service', 'Parking'],
    coordinates: { latitude: 40.7589, longitude: -73.9851 },
    featured: true,
  },
  {
    id: '2',
    name: 'Oceanview Resort',
    location: 'Miami, USA',
    rating: 4.5,
    price: 180,
    image: require('../../assets/images/hotels/hotel2.jpg'),
    description: 'Wake up to breathtaking ocean views at our beachfront resort. Enjoy direct beach access, multiple pools, and authentic coastal cuisine in our award-winning restaurants.',
    amenities: ['Beach Access', 'WiFi', 'Pool', 'Bar', 'Spa', 'Water Sports'],
    coordinates: { latitude: 25.7617, longitude: -80.1918 },
    featured: true,
  },
  {
    id: '3',
    name: 'Mountain Lodge',
    location: 'Aspen, USA',
    rating: 4.9,
    price: 320,
    image: require('../../assets/images/hotels/hotel3.jpg'),
    description: 'Escape to our cozy mountain retreat surrounded by pristine nature. Perfect for skiing enthusiasts and nature lovers, featuring rustic charm with modern comfort.',
    amenities: ['Fireplace', 'Spa', 'Restaurant', 'WiFi', 'Ski Storage', 'Hot Tub'],
    coordinates: { latitude: 39.1911, longitude: -106.8175 },
    featured: true,
  },
  {
    id: '4',
    name: 'City Center Inn',
    location: 'Los Angeles, USA',
    rating: 4.3,
    price: 150,
    image: require('../../assets/images/hotels/hotel1.jpg'),
    description: 'Budget-friendly accommodation in the heart of downtown LA. Close to major attractions, shopping districts, and entertainment venues with comfortable rooms and friendly service.',
    amenities: ['WiFi', 'Parking', 'Breakfast', '24/7 Reception'],
    coordinates: { latitude: 34.0522, longitude: -118.2437 },
    featured: false,
  },
  {
    id: '5',
    name: 'Sunset Paradise',
    location: 'San Diego, USA',
    rating: 4.7,
    price: 200,
    image: require('../../assets/images/hotels/hotel2.jpg'),
    description: 'Beautiful resort near the beach with stunning sunset views. Enjoy our tropical gardens, infinity pool, and Mediterranean-inspired architecture.',
    amenities: ['Pool', 'WiFi', 'Spa', 'Restaurant', 'Beach Shuttle', 'Fitness Center'],
    coordinates: { latitude: 32.7157, longitude: -117.1611 },
    featured: false,
  },
  {
    id: '6',
    name: 'Historic Downtown Hotel',
    location: 'Boston, USA',
    rating: 4.6,
    price: 195,
    image: require('../../assets/images/hotels/hotel3.jpg'),
    description: 'Stay in a beautifully restored historic building with modern amenities. Located in the heart of Boston\'s historic district, walking distance to major landmarks.',
    amenities: ['WiFi', 'Restaurant', 'Bar', 'Concierge', 'Breakfast', 'Business Center'],
    coordinates: { latitude: 42.3601, longitude: -71.0589 },
    featured: false,
  },
];

// Sample reviews data
export const SAMPLE_REVIEWS = {
  '1': [
    {
      id: 'r1',
      userName: 'John Smith',
      rating: 5,
      comment: 'Absolutely amazing hotel! The staff was incredibly helpful and the rooms were spotless. The view from our room was breathtaking. Highly recommend!',
      date: '2025-10-15',
    },
    {
      id: 'r2',
      userName: 'Sarah Johnson',
      rating: 4,
      comment: 'Great location and comfortable rooms. The rooftop pool was a highlight. Only minor issue was the breakfast could have more variety.',
      date: '2025-10-20',
    },
  ],
  '2': [
    {
      id: 'r3',
      userName: 'Michael Brown',
      rating: 5,
      comment: 'Perfect beach getaway! The staff went above and beyond to make our stay special. Direct beach access was amazing.',
      date: '2025-10-18',
    },
  ],
  '3': [
    {
      id: 'r4',
      userName: 'Emily Davis',
      rating: 5,
      comment: 'Absolutely loved this mountain retreat! The fireplace in the room and the mountain views were incredible. Will definitely return.',
      date: '2025-10-22',
    },
  ],
};

// Onboarding slides data
export const ONBOARDING_SLIDES = [
  {
    id: '1',
    title: 'Discover Amazing Hotels',
    description: 'Browse through thousands of hotels worldwide and find your perfect stay with the best prices and deals',
    icon: 'search',
  },
  {
    id: '2',
    title: 'Easy Booking Process',
    description: 'Book your rooms in just a few taps with our seamless and secure booking experience',
    icon: 'calendar',
  },
  {
    id: '3',
    title: 'Share Your Experience',
    description: 'Rate and review hotels to help other travelers make informed decisions for their next trip',
    icon: 'star',
  },
];

// Amenities list with icons
export const AMENITIES = [
  { id: 'wifi', name: 'WiFi', icon: 'wifi' },
  { id: 'pool', name: 'Pool', icon: 'water' },
  { id: 'gym', name: 'Gym', icon: 'fitness' },
  { id: 'restaurant', name: 'Restaurant', icon: 'restaurant' },
  { id: 'spa', name: 'Spa', icon: 'spa' },
  { id: 'parking', name: 'Parking', icon: 'car' },
  { id: 'bar', name: 'Bar', icon: 'wine' },
  { id: 'room-service', name: 'Room Service', icon: 'room-service' },
  { id: 'beach', name: 'Beach Access', icon: 'beach' },
  { id: 'breakfast', name: 'Breakfast', icon: 'cafe' },
  { id: 'fireplace', name: 'Fireplace', icon: 'flame' },
  { id: 'hot-tub', name: 'Hot Tub', icon: 'water' },
];

// Booking status options
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
  COMPLETED: 'completed',
};

// Sort options for explore screen
export const SORT_OPTIONS = [
  { label: 'Default', value: 'none' },
  { label: 'Price: Low to High', value: 'price_low' },
  { label: 'Price: High to Low', value: 'price_high' },
  { label: 'Rating: High to Low', value: 'rating' },
  { label: 'Name: A to Z', value: 'name_asc' },
];