import axios from 'axios';

// Base URLs for APIs
const FAKE_STORE_API_BASE = 'https://fakestoreapi.com';
const OPENWEATHER_API_BASE = 'https://api.openweathermap.org/data/2.5';

// Store your OpenWeatherMap API key securely
// Get a free API key from: https://openweathermap.org/api
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || 'YOUR_OPENWEATHER_API_KEY';

/**
 * Fetch recommended hotels/deals from Fake Store API
 * We'll use the products API and treat items as hotel deals
 */
export const fetchRecommendedDeals = async () => {
  try {
    const response = await axios.get(`${FAKE_STORE_API_BASE}/products`, {
      params: {
        limit: 6, // Get 6 products/deals
      },
    });

    // Transform products into hotel-like deals
    const deals = response.data.map((product) => ({
      id: `deal-${product.id}`,
      name: `${product.title} Hotel`,
      location: product.category === 'electronics' ? 'Tech District' :
                product.category === 'jewelery' ? 'Luxury Quarter' :
                product.category === "men's clothing" ? 'Fashion Avenue' :
                product.category === "women's clothing" ? 'Style Boulevard' :
                'Downtown',
      rating: product.rating.rate,
      price: Math.round(product.price * 10), // Scale up price to look like hotel price
      image: { uri: product.image },
      description: product.description,
      deal: true,
      discount: Math.floor(Math.random() * 30) + 10, // Random discount 10-40%
    }));

    return {
      success: true,
      data: deals,
    };
  } catch (error) {
    console.error('Fetch deals error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch deals',
      data: [],
    };
  }
};

/**
 * Fetch products from Fake Store API by category
 */
export const fetchProductsByCategory = async (category) => {
  try {
    const response = await axios.get(
      `${FAKE_STORE_API_BASE}/products/category/${category}`
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Fetch products error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch products',
      data: [],
    };
  }
};

/**
 * Fetch all categories from Fake Store API
 */
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${FAKE_STORE_API_BASE}/products/categories`);

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Fetch categories error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch categories',
      data: [],
    };
  }
};

/**
 * Fetch weather data for a location using OpenWeatherMap API
 * @param {string} city - City name (e.g., "New York", "London")
 * @param {string} country - Country code (e.g., "US", "UK") - optional
 */
export const fetchWeatherData = async (city, country = '') => {
  try {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
      throw new Error('OpenWeatherMap API key not configured');
    }

    const location = country ? `${city},${country}` : city;
    
    const response = await axios.get(`${OPENWEATHER_API_BASE}/weather`, {
      params: {
        q: location,
        appid: OPENWEATHER_API_KEY,
        units: 'metric', // Use Celsius
      },
    });

    const weatherData = {
      temperature: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      windSpeed: response.data.wind.speed,
      city: response.data.name,
      country: response.data.sys.country,
    };

    return {
      success: true,
      data: weatherData,
    };
  } catch (error) {
    console.error('Fetch weather error:', error);
    
    let errorMessage = 'Failed to fetch weather data';
    
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage = 'City not found';
      } else if (error.response.status === 401) {
        errorMessage = 'Invalid API key';
      }
    } else if (error.message.includes('API key')) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
      data: null,
    };
  }
};

/**
 * Fetch 5-day weather forecast for a location
 */
export const fetchWeatherForecast = async (city, country = '') => {
  try {
    if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
      throw new Error('OpenWeatherMap API key not configured');
    }

    const location = country ? `${city},${country}` : city;
    
    const response = await axios.get(`${OPENWEATHER_API_BASE}/forecast`, {
      params: {
        q: location,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
        cnt: 8, // Get 8 forecasts (24 hours, every 3 hours)
      },
    });

    const forecast = response.data.list.map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      temperature: Math.round(item.main.temp),
      description: item.weather[0].description,
      icon: item.weather[0].icon,
    }));

    return {
      success: true,
      data: forecast,
    };
  } catch (error) {
    console.error('Fetch forecast error:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch forecast',
      data: [],
    };
  }
};

/**
 * Get weather icon URL from OpenWeatherMap
 */
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Extract city name from location string
 * e.g., "New York, USA" -> "New York"
 */
export const extractCityName = (location) => {
  if (!location) return '';
  return location.split(',')[0].trim();
};

/**
 * Extract country code from location string
 * e.g., "New York, USA" -> "US"
 */
export const extractCountryCode = (location) => {
  if (!location || !location.includes(',')) return '';
  const parts = location.split(',');
  const country = parts[parts.length - 1].trim();
  
  // Simple country name to code mapping (extend as needed)
  const countryMap = {
    'USA': 'US',
    'United States': 'US',
    'UK': 'GB',
    'United Kingdom': 'GB',
    'Canada': 'CA',
    'Australia': 'AU',
    'Germany': 'DE',
    'France': 'FR',
    'Spain': 'ES',
    'Italy': 'IT',
  };
  
  return countryMap[country] || country;
};