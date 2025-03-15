<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  city: {
    type: String,
    required: true,
  },
});

// Dummy weather data with adjusted temperatures
const weatherData = ref({
  "RIO DE JANEIRO": {
    hourly: [
      { time: "3:00 PM", temp: 32, precipitation: 0, icon: "01d" },
      { time: "4:00 PM", temp: 33, precipitation: 0, icon: "01d" },
      { time: "5:00 PM", temp: 34, precipitation: 0, icon: "01d" },
      { time: "6:00 PM", temp: 32, precipitation: 0, icon: "01d" },
      { time: "7:00 PM", temp: 30, precipitation: 0, icon: "01n" },
      { time: "8:00 PM", temp: 29, precipitation: 0, icon: "01n" },
      { time: "9:00 PM", temp: 28, precipitation: 0, icon: "01n" },
      { time: "10:00 PM", temp: 27, precipitation: 0, icon: "01n" },
      { time: "11:00 PM", temp: 26, precipitation: 0, icon: "01n" },
      { time: "12:00 AM", temp: 25, precipitation: 0, icon: "01n" },
    ],
    daily: [
      {
        day: "Fri, Nov 1",
        condition: "Clear throughout the day.",
        high: 34,
        low: 25,
        icon: "01d",
      },
      {
        day: "Sat, Nov 2",
        condition: "Clear throughout the day.",
        high: 33,
        low: 24,
        icon: "01d",
      },
      {
        day: "Sun, Nov 3",
        condition: "Clear throughout the day.",
        high: 32,
        low: 23,
        icon: "01d",
      },
      {
        day: "Mon, Nov 4",
        condition: "Clear throughout the day.",
        high: 31,
        low: 22,
        icon: "01d",
      },
      {
        day: "Tue, Nov 5",
        condition: "Clear throughout the day.",
        high: 30,
        low: 21,
        icon: "01d",
      },
    ],
  },
  BEIJING: {
    hourly: [
      { time: "3:00 PM", temp: 15, precipitation: 10, icon: "02d" },
      { time: "4:00 PM", temp: 14, precipitation: 15, icon: "02d" },
      { time: "5:00 PM", temp: 13, precipitation: 20, icon: "02d" },
      { time: "6:00 PM", temp: 12, precipitation: 25, icon: "02d" },
      { time: "7:00 PM", temp: 11, precipitation: 30, icon: "02n" },
      { time: "8:00 PM", temp: 10, precipitation: 35, icon: "02n" },
      { time: "9:00 PM", temp: 9, precipitation: 40, icon: "02n" },
      { time: "10:00 PM", temp: 8, precipitation: 45, icon: "02n" },
      { time: "11:00 PM", temp: 7, precipitation: 50, icon: "02n" },
      { time: "12:00 AM", temp: 6, precipitation: 55, icon: "02n" },
    ],
    daily: [
      {
        day: "Fri, Nov 1",
        condition: "Partly cloudy.",
        high: 15,
        low: 6,
        icon: "02d",
      },
      {
        day: "Sat, Nov 2",
        condition: "Mostly sunny.",
        high: 16,
        low: 7,
        icon: "01d",
      },
      {
        day: "Sun, Nov 3",
        condition: "Clear skies.",
        high: 14,
        low: 5,
        icon: "01d",
      },
      {
        day: "Mon, Nov 4",
        condition: "Partly cloudy.",
        high: 13,
        low: 4,
        icon: "02d",
      },
      {
        day: "Tue, Nov 5",
        condition: "Scattered clouds.",
        high: 12,
        low: 3,
        icon: "03d",
      },
    ],
  },
  "LOS ANGELES": {
    hourly: [
      { time: "3:00 PM", temp: 24, precipitation: 0, icon: "01d" },
      { time: "4:00 PM", temp: 25, precipitation: 0, icon: "01d" },
      { time: "5:00 PM", temp: 26, precipitation: 0, icon: "01d" },
      { time: "6:00 PM", temp: 24, precipitation: 0, icon: "01d" },
      { time: "7:00 PM", temp: 23, precipitation: 0, icon: "01n" },
      { time: "8:00 PM", temp: 22, precipitation: 0, icon: "01n" },
      { time: "9:00 PM", temp: 21, precipitation: 0, icon: "01n" },
      { time: "10:00 PM", temp: 20, precipitation: 0, icon: "01n" },
      { time: "11:00 PM", temp: 19, precipitation: 0, icon: "01n" },
      { time: "12:00 AM", temp: 18, precipitation: 0, icon: "01n" },
    ],
    daily: [
      {
        day: "Fri, Nov 1",
        condition: "Sunny and clear.",
        high: 26,
        low: 18,
        icon: "01d",
      },
      {
        day: "Sat, Nov 2",
        condition: "Clear skies.",
        high: 25,
        low: 17,
        icon: "01d",
      },
      {
        day: "Sun, Nov 3",
        condition: "Mostly sunny.",
        high: 24,
        low: 16,
        icon: "02d",
      },
      {
        day: "Mon, Nov 4",
        condition: "Sunny periods.",
        high: 23,
        low: 15,
        icon: "02d",
      },
      {
        day: "Tue, Nov 5",
        condition: "Clear and warm.",
        high: 22,
        low: 14,
        icon: "01d",
      },
    ],
  },
});

const cityData = computed(() => weatherData.value[props.city]);

const getWeatherIcon = (code) => {
  return `https://openweathermap.org/img/wn/${code}@2x.png`;
};

const lastUpdated = "Oct 31 15:32";

const isHot = computed(() => {
  const currentTemp = cityData.value.hourly[0].temp;
  return currentTemp >= 20;
});
</script>

<template>
  <div class="weather-container" :class="{ hot: isHot, cold: !isHot }">
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
  </div>
</template>

<style scoped>
.weather-container {
  padding: 1rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  transition: all 0.5s ease;
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

@media (max-width: 600px) {
  .weather-container {
    padding: 0.5rem;
  }

  .hour-item {
    min-width: 70px;
  }
}
</style>
