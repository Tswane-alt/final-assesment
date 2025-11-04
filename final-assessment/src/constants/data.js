// src/constants/data.js

export const SAMPLE_HOTELS = [
  {
    id: '1',
    name: 'Grand Plaza Hotel',
    location: 'New York, USA',
    rating: 4.5,
    pricePerNight: 250,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    description: 'Luxurious hotel in the heart of Manhattan with stunning city views and world-class amenities.',
    amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa'],
    reviews: [
      {
        id: 'r1',
        userId: 'user1',
        userName: 'John Doe',
        rating: 5,
        comment: 'Excellent service and beautiful rooms!',
        date: '2024-10-15',
      },
      {
        id: 'r2',
        userId: 'user2',
        userName: 'Jane Smith',
        rating: 4,
        comment: 'Great location, but a bit pricey.',
        date: '2024-10-10',
      },
    ],
  },
  {
    id: '2',
    name: 'Seaside Resort',
    location: 'Miami, Florida',
    rating: 4.8,
    pricePerNight: 180,
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    description: 'Beautiful beachfront resort with private beach access and ocean view rooms.',
    amenities: ['WiFi', 'Beach Access', 'Pool', 'Restaurant', 'Bar'],
    reviews: [
      {
        id: 'r3',
        userId: 'user3',
        userName: 'Mike Johnson',
        rating: 5,
        comment: 'Perfect vacation spot! The beach is amazing.',
        date: '2024-10-20',
      },
    ],
  },
  {
    id: '3',
    name: 'Mountain Lodge',
    location: 'Aspen, Colorado',
    rating: 4.3,
    pricePerNight: 200,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
    description: 'Cozy mountain retreat perfect for skiing and winter sports enthusiasts.',
    amenities: ['WiFi', 'Fireplace', 'Ski Storage', 'Restaurant', 'Hot Tub'],
    reviews: [
      {
        id: 'r4',
        userId: 'user4',
        userName: 'Sarah Williams',
        rating: 4,
        comment: 'Cozy and comfortable. Great for families.',
        date: '2024-10-18',
      },
    ],
  },
  {
    id: '4',
    name: 'City Center Inn',
    location: 'Los Angeles, California',
    rating: 4.0,
    pricePerNight: 150,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    description: 'Modern hotel in downtown LA, close to major attractions and entertainment venues.',
    amenities: ['WiFi', 'Gym', 'Parking', 'Restaurant'],
    reviews: [],
  },
  {
    id: '5',
    name: 'Royal Palace Hotel',
    location: 'Paris, France',
    rating: 4.9,
    pricePerNight: 400,
    image: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800',
    description: 'Elegant 5-star hotel near the Eiffel Tower with luxurious accommodations.',
    amenities: ['WiFi', 'Concierge', 'Spa', 'Fine Dining', 'Room Service'],
    reviews: [
      {
        id: 'r5',
        userId: 'user5',
        userName: 'Emily Brown',
        rating: 5,
        comment: 'Absolutely stunning! Worth every penny.',
        date: '2024-10-25',
      },
    ],
  },
];

export const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Discover Amazing Hotels',
    description: 'Browse through thousands of hotels worldwide and find your perfect stay',
    image: require('../../assets/images/Materials/Onboarding/Onboarding1.png'),
  },
  {
    id: '2',
    title: 'Easy Booking Process',
    description: 'Book your rooms in just a few taps with our seamless booking experience',
    image: require('../../assets/images/Materials/Onboarding/Onboarding2.png'),
  },
  {
    id: '3',
    title: 'Start Your Journey',
    description: 'Get ready to explore amazing destinations and create unforgettable memories',
    image: require('../../assets/images/Materials/Onboarding/Onboarding3.png'),
  },
];