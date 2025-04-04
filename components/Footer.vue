<template>
  <footer class="bg-background-soft dark:bg-background py-12">
    <div class="jp-container">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 class="text-lg mb-5 flex items-center tracking-widest">
            <span class="bg-primary-600 text-white dark:bg-primary-700 p-1 rounded-md mr-3 text-xs">CC</span>
            Climate Change Insights
          </h3>
          <p class="text-muted-foreground text-sm leading-relaxed">
            Exploring the science, impacts, and solutions to our planet's most pressing challenge.
          </p>
        </div>
        <div>
          <h3 class="text-base mb-5 text-primary-700 dark:text-primary-400">Topics</h3>
          <ul class="space-y-3">
            <li>
              <NuxtLink 
                to="/blog" 
                class="text-sm text-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                All Blog Posts
              </NuxtLink>
            </li>
            <li v-for="category in displayCategories" :key="category.id">
              <NuxtLink 
                :to="`/category/${category.slug}`" 
                class="text-sm text-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                {{ category.name }}
              </NuxtLink>
            </li>
          </ul>
        </div>
        <div>
          <h3 class="text-base mb-5 text-primary-700 dark:text-primary-400">Connect</h3>
          <div class="flex space-x-5">
            <a href="#" class="text-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <span class="sr-only">Twitter</span>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" class="text-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              <span class="sr-only">GitHub</span>
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
          <div class="mt-6">
            <h4 class="text-sm mb-3">Subscribe to our newsletter</h4>
            <form @submit.prevent="handleSubmit" class="flex">
              <input 
                v-model="email"
                type="email" 
                placeholder="Your email" 
                class="flex-1 py-2 px-3 rounded-l-md border-y border-l border-primary-200 dark:border-primary-700 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500 text-sm"
                :disabled="isSubscribing || isAlreadySubscribed"
                :class="{ 'border-red-400 focus:ring-red-400': subscriptionError }"
              />
              <button 
                type="submit" 
                class="bg-primary-600 hover:bg-primary-700 text-white px-3 py-2 rounded-r-md text-sm flex items-center justify-center min-w-[100px]"
                :disabled="isSubscribing || isAlreadySubscribed"
              >
                <svg v-if="isSubscribing" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ buttonText }}
              </button>
            </form>
            <p v-if="subscriptionError" class="text-red-500 text-sm mt-1">{{ subscriptionError }}</p>
            <p v-if="subscriptionSuccess" class="text-green-500 text-sm mt-1">Thank you for subscribing!</p>
          </div>
        </div>
      </div>
      <div class="mt-12 pt-6 border-t border-primary-100 dark:border-primary-800 text-center text-xs text-muted-foreground">
        <p>&copy; {{ new Date().getFullYear() }} Climate Change Insights. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const categories = ref([]);
const { getCategories } = useFirestore();
const email = ref('');

// Import newsletter composable
const { 
  isSubscribing, 
  subscriptionError, 
  subscriptionSuccess, 
  isAlreadySubscribed, 
  subscribeToNewsletter 
} = useNewsletter();

// Only show first 5 categories in footer
const displayCategories = computed(() => {
  return categories.value.slice(0, 5);
});

// Dynamic button text based on subscription state
const buttonText = computed(() => {
  if (isAlreadySubscribed.value) return 'Subscribed';
  if (isSubscribing.value) return 'Subscribing...';
  return 'Subscribe';
});

// Handle form submission
const handleSubmit = async () => {
  if (!isAlreadySubscribed.value) {
    await subscribeToNewsletter(email.value);
  }
};

onMounted(async () => {
  categories.value = await getCategories();
});
</script> 