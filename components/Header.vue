<template>
  <header class="border-b border-primary-100 dark:border-primary-800 bg-white dark:bg-background py-4 sticky top-0 z-50 shadow-sm">
    <div class="jp-container mx-auto">
      <div class="flex items-center justify-between">
        <!-- Logo Section -->
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="text-xl font-normal text-primary-800 dark:text-primary-400 tracking-wide flex items-center">
            <span class="bg-primary-600 text-white dark:bg-primary-700 p-1.5 rounded-md mr-3 text-sm">CC</span>
            <span class="tracking-widest">ClimChang</span>
          </NuxtLink>
          <nav class="hidden md:block">
            <ul class="flex gap-8">
              <li>
                <NuxtLink to="/" class="text-foreground hover:text-primary-700 dark:hover:text-primary-400 transition-colors">
                  Home
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/blog" class="text-foreground hover:text-primary-700 dark:hover:text-primary-400 transition-colors">
                  Blog
                </NuxtLink>
              </li>
              <li>
                <div class="relative dropdown">
                  <button 
                    @click="toggleDropdown" 
                    class="text-foreground hover:text-primary-700 dark:hover:text-primary-400 transition-colors flex items-center"
                  >
                    Categories
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div 
                    v-if="dropdownOpen"
                    class="absolute left-0 mt-2 w-48 rounded-md shadow-md py-1 bg-card border border-border z-10"
                  >
                    <NuxtLink 
                      v-for="category in moreCategories" 
                      :key="category.id"
                      :to="`/category/${category.slug}`" 
                      class="block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                      @click="dropdownOpen = false"
                    >
                      {{ category.name }}
                    </NuxtLink>
                  </div>
                </div>
              </li>
            </ul>
          </nav>
        </div>
        
        <!-- Search & Actions Section -->
        <div class="flex items-center gap-6">
          <div class="hidden md:block w-64 search-container">
            <SearchBar />
          </div>
          
          <button 
            @click="toggleColorMode" 
            class="p-1.5 rounded-md text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800/40 transition-colors"
            aria-label="Toggle dark mode"
          >
            <div v-if="colorMode === 'dark'" class="w-5 h-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
              </svg>
            </div>
            <div v-else class="w-5 h-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
              </svg>
            </div>
          </button>
          
          <button 
            @click="mobileMenuOpen = !mobileMenuOpen" 
            class="md:hidden p-1.5 rounded-md text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-800/40 transition-colors"
            aria-label="Toggle mobile menu"
          >
            <div class="w-5 h-5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile menu -->
    <div 
      v-if="mobileMenuOpen" 
      class="md:hidden jp-container py-4 mt-4 border-t border-primary-100 dark:border-primary-800"
    >
      <div class="mb-4">
        <SearchBar />
      </div>
      <nav>
        <ul class="flex flex-col gap-2">
          <li>
            <NuxtLink to="/" class="block py-2 text-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Home
            </NuxtLink>
          </li>
          <li>
            <NuxtLink to="/blog" class="block py-2 text-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
              Blog
            </NuxtLink>
          </li>
          <li v-for="category in categories" :key="category.id">
            <NuxtLink 
              :to="`/category/${category.slug}`" 
              class="block py-2 text-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              {{ category.name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import SearchBar from '~/components/SearchBar.vue';

const { colorMode, toggleColorMode } = useColorMode();
const mobileMenuOpen = ref(false);
const categories = ref([]);
const dropdownOpen = ref(false);
const { getCategories } = useFirestore();


// Additional categories for dropdown
const moreCategories = computed(() => {
  return categories.value
});

function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.dropdown');
  if (dropdown && !dropdown.contains(event.target) && dropdownOpen.value) {
    dropdownOpen.value = false;
  }
};

onMounted(async () => {
  categories.value = await getCategories();
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.search-container {
  position: relative;
}
</style> 