<script setup>
import { ref, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const searchInput = ref("");

// Handle key events
const handleKeydown = (e) => {
  if (e.key === "Escape") {
    emit("close");
  } else if (e.key === "Enter") {
    handleSearch();
  }
};

const handleSearch = () => {
  // Placeholder for future search implementation
  console.log("Search triggered for:", searchInput.value);
};

// Add event listener when component is mounted
onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

// Remove event listener when component is unmounted
onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});

// Clear input when modal is closed
watch(
  () => props.isOpen,
  (newValue) => {
    if (!newValue) {
      searchInput.value = "";
    }
  }
);
</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="modal-overlay" @click="emit('close')">
      <div class="modal-content" @click.stop>
        <div class="search-container">
          <input
            type="text"
            v-model="searchInput"
            placeholder="Search city..."
            class="search-input"
            autofocus
          />
          <button class="search-button" @click="handleSearch">
            <span class="arrow">→</span>
          </button>
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
  gap: 0.75rem;
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
}

.search-input::placeholder {
  color: rgba(33, 53, 71, 0.6);
}

.search-input:focus {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(25, 118, 210, 0.5);
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
}

.search-button {
  background: rgba(25, 118, 210, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 8px;
  width: 42px;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
  backdrop-filter: blur(5px);
}

.search-button:hover {
  background: rgba(25, 118, 210, 0.9);
  border-color: rgba(255, 255, 255, 0.8);
}

.arrow {
  color: white;
  font-size: 1.2rem;
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
