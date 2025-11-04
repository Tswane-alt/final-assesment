// src/utils/helpers.js

export const calculateTotalCost = (pricePerNight, checkInDate, checkOutDate, rooms = 1) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  
  const timeDiff = checkOut.getTime() - checkIn.getTime();
  const numberOfNights = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  const totalCost = pricePerNight * numberOfNights * rooms;
  
  return {
    numberOfNights,
    totalCost,
    pricePerNight,
    rooms,
  };
};

export const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

export const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};

export const generateBookingId = () => {
  return 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export const sortHotels = (hotels, sortBy = 'default') => {
  const hotelsCopy = [...hotels];
  
  switch (sortBy) {
    case 'price-low':
      return hotelsCopy.sort((a, b) => a.pricePerNight - b.pricePerNight);
    case 'price-high':
      return hotelsCopy.sort((a, b) => b.pricePerNight - a.pricePerNight);
    case 'rating':
      return hotelsCopy.sort((a, b) => b.rating - a.rating);
    case 'name':
      return hotelsCopy.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return hotelsCopy;
  }
};