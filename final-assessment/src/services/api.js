// src/services/api.js
import axios from 'axios';

const FAKE_STORE_API = 'https://fakestoreapi.com';
const WEATHER_API_KEY = 'ea96f0beca1ff7d95f407aaf92171a65'; // Get from https://openweathermap.org/api
const WEATHER_API = 'https://api.openweathermap.org/data/2.5/weather';

// Fetch products from Fake Store API (treat as hotel deals)
export const fetchDeals = async () => {
  try {
    const response = await axios.get(`${FAKE_STORE_API}/products?limit=5`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error('Error fetching deals:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Fetch weather for hotel location
export const fetchWeather = async (latitude, longitude) => {
  try {
    if (!WEATHER_API_KEY || WEATHER_API_KEY === 'YOUR_OPENWEATHER_API_KEY') {
      // Return mock data if API key not set
      return {
        success: true,
        data: {
          temp: 22,
          description: 'Clear sky',
          humidity: 65,
          windSpeed: 5.2,
        },
        mock: true,
      };
    }

    const response = await axios.get(WEATHER_API, {
      params: {
        lat: latitude,
        lon: longitude,
        appid: WEATHER_API_KEY,
        units: 'metric',
      },
    });

    return {
      success: true,
      data: {
        temp: response.data.main.temp,
        description: response.data.weather[0].description,
        humidity: response.data.main.humidity,
        windSpeed: response.data.wind.speed,
      },
      mock: false,
    };
  } catch (error) {
    console.error('Error fetching weather:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};