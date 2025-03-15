<script setup>
import { ref } from "vue";
import WeatherDisplay from "./components/WeatherDisplay.vue";
import SearchModal from "./components/SearchModal.vue";

const cities = [
  { id: 1, name: "RIO DE JANEIRO" },
  { id: 2, name: "BEIJING" },
  { id: 3, name: "LOS ANGELES" },
];

const selectedCity = ref(cities[0]);
const isSearchModalOpen = ref(false);

const selectCity = (city) => {
  selectedCity.value = city;
};

const toggleSearchModal = () => {
  isSearchModalOpen.value = !isSearchModalOpen.value;
};
</script>

<template>
  <div class="header">
    <div class="title-container">
      <h1>Simple Weather</h1>
      <div class="selected-city">{{ selectedCity.name }}</div>
    </div>
    <div class="header-icons">
      <span class="refresh-icon">↻</span>
      <span class="search-icon" @click="toggleSearchModal">🔍</span>
    </div>
  </div>

  <div class="tabs-container">
    <div class="tabs">
      <button
        v-for="city in cities"
        :key="city.id"
        class="tab"
        :class="{ active: selectedCity.id === city.id }"
        @click="selectCity(city)"
      >
        {{ city.name }}
      </button>
    </div>
  </div>

  <WeatherDisplay :city="selectedCity.name" />

  <SearchModal :is-open="isSearchModalOpen" @close="toggleSearchModal" />
</template>

<style scoped>
.header {
  background-color: #1976d2;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-container {
  display: flex;
  flex-direction: column;
}

.title-container h1 {
  margin: 0;
  font-size: 1.5rem;
}

.selected-city {
  font-size: 0.9rem;
  opacity: 0.9;
  margin-top: 0.2rem;
}

.header-icons {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-icon,
.refresh-icon {
  font-size: 1.5rem;
  cursor: pointer;
}

.refresh-icon {
  display: inline-block;
  transition: transform 0.3s ease;
}

.refresh-icon:hover {
  transform: rotate(180deg);
}

.tabs-container {
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.tabs {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.tab {
  padding: 1rem 0.5rem;
  color: #757575;
  cursor: pointer;
  border: none;
  background: none;
  font-size: 0.9rem;
  position: relative;
  transition: color 0.3s;
}

.tab.active {
  color: #000000;
}

.tab.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #000000;
}

@media (max-width: 600px) {
  .tabs {
    gap: 1rem;
  }

  .tab {
    padding: 0.75rem 0.25rem;
    font-size: 0.8rem;
  }
}
</style>
