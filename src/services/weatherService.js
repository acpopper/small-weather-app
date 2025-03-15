import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
// Only allowed to use the forecast endpoint (free)
const BASE_URL = "https://api.openweathermap.org/data/2.5/forecast";

export const weatherService = {
  async get3Hourly5DaysForecast(city) {
    try {
      const response = await axios.get(`${BASE_URL}`, {
        params: {
          q: city,
          appid: API_KEY,
          units: "metric",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching hourly forecast:", error);
      throw error;
    }
  },
};
