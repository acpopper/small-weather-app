import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const weatherService = {
  async getCurrentWeather(city) {
    try {
      const response = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric", // Para obtener temperaturas en Celsius
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching weather data:", error);
      throw error;
    }
  },

  async getForecast(city) {
    try {
      const response = await axios.get(`${BASE_URL}/forecast`, {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
          cnt: 5, // Limitamos a 5 días de pronóstico
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching forecast data:", error);
      throw error;
    }
  },
};
