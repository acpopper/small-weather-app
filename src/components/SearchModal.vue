<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";
import { searchCities } from "../services/cityService";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close", "select-city"]);

const searchInput = ref("");
const recommendations = ref([]);
const selectedIndex = ref(-1);
const loading = ref(false);

// Handle search input changes with debounce
let debounceTimeout;
const handleSearchInput = () => {
  clearTimeout(debounceTimeout);
  loading.value = true;

  debounceTimeout = setTimeout(() => {
    recommendations.value = searchCities(searchInput.value);
    loading.value = false;
  }, 300);
};

// Handle city selection
const selectCity = (city) => {
  emit("select-city", {
    id: city.id,
    name: city.name,
    country: city.country,
  });
  emit("close");
};

// Handle key navigation
const handleKeydown = (e) => {
  if (e.key === "Escape") {
    emit("close");
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedIndex.value = Math.min(
      selectedIndex.value + 1,
      recommendations.value.length - 1
    );
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedIndex.value = Math.max(selectedIndex.value - 1, -1);
  } else if (e.key === "Enter") {
    if (
      selectedIndex.value >= 0 &&
      recommendations.value[selectedIndex.value]
    ) {
      selectCity(recommendations.value[selectedIndex.value]);
    }
  }
};

// Reset state when modal is closed
watch(
  () => props.isOpen,
  (newValue) => {
    if (!newValue) {
      searchInput.value = "";
      recommendations.value = [];
      selectedIndex.value = -1;
    }
  }
);

// Add event listener when component is mounted
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

// Remove event listener when component is unmounted
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click="emit('close')">
      <div class="modal-content" @click.stop>
        <div class="search-container">
          <div class="input-wrapper">
            <input
              type="text"
              v-model="searchInput"
              @input="handleSearchInput"
              placeholder="Search city..."
              class="search-input"
              autofocus
            />
            <div v-if="loading" class="loading-indicator">
              <span class="loading-spinner">↻</span>
            </div>
          </div>

          <div v-if="recommendations.length > 0" class="recommendations">
            <div
              v-for="(city, index) in recommendations"
              :key="city.id"
              class="recommendation-item"
              :class="{ selected: index === selectedIndex }"
              @click="selectCity(city)"
              @mouseenter="selectedIndex = index"
            >
              <span class="city-name">{{ city.name }}</span>
              <span class="country-name">{{ city.country }}</span>
            </div>
          </div>

          <div v-else-if="searchInput && !loading" class="no-results">
            No cities found
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-content {
  background: rgba(255, 255, 255, 0.75);
  padding: 1.5rem;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.search-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  color: #213547;
  backdrop-filter: blur(5px);
  width: 100%;
}

.search-input::placeholder {
  color: rgba(33, 53, 71, 0.6);
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(25, 118, 210, 0.5);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.loading-indicator {
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
}

.loading-spinner {
  display: inline-block;
  animation: spin 1s linear infinite;
  color: #1976d2;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.recommendations {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
}

.recommendation-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.2s;
}

.recommendation-item:hover,
.recommendation-item.selected {
  background-color: rgba(25, 118, 210, 0.1);
}

.city-name {
  font-weight: 500;
}

.country-name {
  color: #666;
  font-size: 0.9em;
}

.no-results {
  text-align: center;
  padding: 1rem;
  color: #666;
}

/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.modal-enter-to,
.modal-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
