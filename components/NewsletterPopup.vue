<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isVisible && !isAlreadySubscribed" 
        class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50"
        @click.self="closeModal"
      >
        <div 
          class="bg-white dark:bg-background w-full max-w-md rounded-xl shadow-xl overflow-hidden transform transition-all"
          :class="{ 'scale-100 opacity-100': isVisible, 'scale-90 opacity-0': !isVisible }"
        >
          <!-- Close button -->
          <button 
            @click="closeModal" 
            class="absolute top-3 right-3 text-muted-foreground hover:text-foreground p-1 rounded-full transition-colors"
            aria-label="Close newsletter popup"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <!-- Content -->
          <div class="p-6 md:p-8">
            <div class="text-center mb-6">
              <div class="inline-flex items-center justify-center bg-primary-50 dark:bg-primary-900/30 p-3 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 class="text-xl md:text-2xl font-bold text-foreground mb-2">Stay Updated on Climate Change</h2>
              <p class="text-muted-foreground text-sm md:text-base">
                Subscribe to our newsletter to receive the latest climate insights and solutions directly to your inbox.
              </p>
            </div>
            
            <form @submit.prevent="handleSubmit" class="space-y-4">
              <div>
                <label for="popup-email" class="sr-only">Email address</label>
                <input 
                  id="popup-email" 
                  v-model="email" 
                  type="email" 
                  placeholder="Enter your email address" 
                  required
                  class="w-full py-3 px-4 rounded-md border border-primary-200 dark:border-primary-700 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                  :disabled="isSubscribing"
                  :class="{ 'border-red-400 focus:ring-red-400': subscriptionError }"
                />
                <p v-if="subscriptionError" class="text-red-500 text-sm mt-1">{{ subscriptionError }}</p>
              </div>
              
              <button 
                type="submit" 
                class="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-md transition-colors flex items-center justify-center"
                :disabled="isSubscribing"
              >
                <svg v-if="isSubscribing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ isSubscribing ? 'Subscribing...' : 'Subscribe' }}
              </button>
            </form>
            
            <!-- Success message -->
            <Transition name="fade">
              <div v-if="subscriptionSuccess" class="absolute inset-0 bg-white dark:bg-background flex flex-col items-center justify-center text-center p-8">
                <div class="inline-flex items-center justify-center bg-green-50 dark:bg-green-900/30 p-3 rounded-full mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-foreground mb-2">Thank You for Subscribing!</h3>
                <p class="text-muted-foreground mb-6">You'll be the first to receive our latest climate insights.</p>
                <button 
                  @click="closeModal" 
                  class="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue';

const isVisible = ref(false);
const email = ref('');
const hasInteracted = ref(false);
const { colorMode } = useColorMode();

// Import newsletter composable
const { 
  isSubscribing, 
  subscriptionError, 
  subscriptionSuccess, 
  isAlreadySubscribed, 
  subscribeToNewsletter 
} = useNewsletter();

// Track user interaction
const trackUserInteraction = () => {
  if (!hasInteracted.value) {
    hasInteracted.value = true;
    
    // Show popup after user has interacted with the site for 20 seconds
    setTimeout(() => {
      if (!isAlreadySubscribed.value) {
        isVisible.value = true;
      }
    }, 20000); // 20 seconds after interaction
  }
};

// Set up event listeners for user interaction
onMounted(() => {
  if (process.client && !isAlreadySubscribed.value) {
    // Add event listeners to track user interactions with debounce
    const interactionEvents = ['click', 'scroll', 'mousemove', 'keydown'];
    interactionEvents.forEach(event => {
      document.addEventListener(event, trackUserInteraction, { once: true });
    });
  }
});

// Cleanup function to remove event listeners
onBeforeUnmount(() => {
  if (process.client) {
    const interactionEvents = ['click', 'scroll', 'mousemove', 'keydown'];
    interactionEvents.forEach(event => {
      document.removeEventListener(event, trackUserInteraction);
    });
  }
});

// Close modal function
const closeModal = () => {
  isVisible.value = false;
};

// Handle form submission
const handleSubmit = async () => {
  await subscribeToNewsletter(email.value);
};

// Close modal after successful subscription with a delay
watch(subscriptionSuccess, (newValue) => {
  if (newValue) {
    setTimeout(() => {
      closeModal();
    }, 3000);
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 