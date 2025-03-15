<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { weatherService } from "../services/weatherService";
import { formatCityName } from "../utils/cityFormat";

const props = defineProps({
  city: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["loadingChange"]); // For triggering the spinning animation of the arrow wheel

const weatherData = ref({});
const loading = ref(false);
const error = ref(null);
const lastUpdated = ref("");

const fetchWeatherData = async (city) => {
  loading.value = true;
  emit("loadingChange", true);
  error.value = null;
  try {
    const [forecastData] = await Promise.all([
      weatherService.get3Hourly5DaysForecast(formatCityName(city)),
    ]);

    // Calculate the next 10 steps (3 hour intervals)
    const hourly = forecastData.list.slice(0, 10).map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
      temp: Math.round(item.main.temp),
      precipitation: Math.round(item.pop * 100),
      icon: item.weather[0].icon,
    }));

    // Aggregate the data from the 3-hourly data to make the next 5 days
    const daily = forecastData.list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });

      const existingDay = acc.find((day) => day.day === date);
      if (existingDay) {
        existingDay.high = Math.max(
          existingDay.high,
          Math.round(item.main.temp_max)
        );
        existingDay.low = Math.min(
          existingDay.low,
          Math.round(item.main.temp_min)
        );
        existingDay.condition = item.weather[0].description; // Update condition to the latest (we dont have the data because of the free plan)
        existingDay.icon = item.weather[0].icon; // Update icon to the latest (we dont have the data because of the free plan)
      } else {
        acc.push({
          day: date,
          condition: item.weather[0].description,
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          icon: item.weather[0].icon,
        });
      }
      return acc;
    }, []);

    weatherData.value[city] = {
      hourly,
      daily: daily.slice(1), // Remove the first day because it's the current day (last day will always have the same min and max temp because of how the data comes (last 3 hour step))
    };

    lastUpdated.value = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch (err) {
    error.value = "Error fetching weather data. Please try again later.";
    console.error("Error:", err);
  } finally {
    loading.value = false;
    emit("loadingChange", false);
  }
};

onMounted(() => {
  fetchWeatherData(props.city);
});

watch(
  () => props.city,
  (newCity) => {
    fetchWeatherData(newCity);
  }
);

const cityData = computed(
  () => weatherData.value[props.city] || { hourly: [], daily: [] }
);

const getWeatherIcon = (code) => {
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
};

const isHot = computed(() => {
  if (cityData.value.hourly && cityData.value.hourly.length > 0) {
    const currentTemp = cityData.value.hourly[0].temp;
    return currentTemp >= 20;
  }
  return false;
});
</script>

<template>
  <div class="weather-container" :class="{ hot: isHot, cold: !isHot }">
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">Loading weather data...</div>
    </div>
    <div v-else-if="error" class="error-overlay">
      <div class="error-content">{{ error }}</div>
    </div>
    <template v-else>
      <div class="weather-card">
        <h2>Next hours</h2>
        <div class="hourly-forecast">
          <div
            v-for="(hour, index) in cityData.hourly"
            :key="index"
            class="hour-item"
          >
            <div>{{ hour.time }}</div>
            <img
              :src="getWeatherIcon(hour.icon)"
              :alt="hour.condition"
              class="weather-icon"
            />
            <div class="temperature">{{ hour.temp }}°</div>
            <div class="precipitation">{{ hour.precipitation }}%</div>
          </div>
        </div>
      </div>

      <div class="weather-card">
        <h2>Next 5 days</h2>
        <div class="daily-forecast">
          <div
            v-for="(day, index) in cityData.daily"
            :key="index"
            class="day-item"
          >
            <img
              :src="getWeatherIcon(day.icon)"
              :alt="day.condition"
              class="weather-icon"
            />
            <div class="day-info">
              <div>
                <strong>{{ day.day }}</strong>
              </div>
              <div>{{ day.condition }}</div>
            </div>
            <div class="day-temp">{{ day.high }}° {{ day.low }}°</div>
          </div>
        </div>
      </div>

      <div class="last-updated">Last updated on {{ lastUpdated }}</div>
    </template>
  </div>
</template>

<style scoped>
.weather-container {
  padding: 1rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  transition: all 0.5s ease;
  position: relative;
}

.weather-container.hot {
  background: linear-gradient(135deg, #ff6b6b, #ffd93d);
}

.weather-container.cold {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
}

.weather-card {
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.weather-card h2 {
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

.hourly-forecast {
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: #1976d2 transparent;
}

.hourly-forecast::-webkit-scrollbar {
  height: 6px;
}

.hourly-forecast::-webkit-scrollbar-track {
  background: transparent;
}

.hourly-forecast::-webkit-scrollbar-thumb {
  background-color: #1976d2;
  border-radius: 3px;
}

.hour-item {
  flex: 0 0 auto;
  min-width: 80px;
  text-align: center;
}

.temperature {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0.5rem 0;
}

.precipitation {
  color: #03a9f4;
}

.daily-forecast .day-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.day-item:last-child {
  border-bottom: none;
}

.day-info {
  flex: 1;
  margin-left: 1rem;
}

.day-temp {
  text-align: right;
}

.weather-icon {
  width: 50px;
  height: 50px;
}

.last-updated {
  text-align: center;
  color: #757575;
  font-size: 0.9rem;
  padding: 0.5rem;
  background: white;
  border-radius: 8px;
  margin-top: 1rem;
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.loading-content,
.error-content {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-content {
  color: #dc3545;
}

@media (max-width: 600px) {
  .weather-container {
    padding: 0.5rem;
  }

  .hour-item {
    min-width: 70px;
  }
}
</style>
