<template>
  <div class="relative">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search posts..."
        class="w-full py-2 pl-9 pr-3 border border-primary-200 dark:border-primary-700 bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-400 transition-all text-sm"
        @focus="showResults = true"
        @keydown.esc="hideResults"
        @keydown.down.prevent="navigateResults('down')"
        @keydown.up.prevent="navigateResults('up')"
        @keydown.enter="selectResult"
      />
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-primary-500 dark:text-primary-400">
          <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
      </div>
    </div>
    
    <div
      v-if="showResults && filteredPosts.length > 0"
      class="absolute z-20 w-full mt-1 overflow-hidden bg-card border border-primary-200 dark:border-primary-700 shadow-sm max-h-72 overflow-y-auto"
    >
      <ul class="py-1">
        <li
          v-for="(post, index) in filteredPosts"
          :key="post.id"
          :class="[
            'px-3 py-2 cursor-pointer hover:bg-primary-50 dark:hover:bg-primary-800/40 transition-colors',
            index === activeIndex ? 'bg-primary-50 dark:bg-primary-800/40' : ''
          ]"
          @click="goToPost(post.slug)"
          @mouseenter="activeIndex = index"
        >
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 mt-1">
              <div class="w-6 h-6 bg-primary-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div class="flex-1">
              <div class="text-sm text-foreground">{{ post.title }}</div>
              <div class="text-xs text-muted-foreground line-clamp-1 mt-1">{{ post.excerpt }}</div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    
    <div
      v-else-if="showResults && searchQuery && !filteredPosts.length"
      class="absolute z-20 w-full mt-1 overflow-hidden bg-card border border-primary-200 dark:border-primary-700 shadow-sm"
    >
      <div class="px-3 py-3 text-xs text-muted-foreground flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        No results found for "<span class="font-medium">{{ searchQuery }}</span>"
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';

const router = useRouter();
const searchQuery = ref('');
const showResults = ref(false);
const activeIndex = ref(0);
const posts = ref([]);
const { getPosts } = useFirestore();

onMounted(async () => {
  posts.value = await getPosts();
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const filteredPosts = computed(() => {
  if (!searchQuery.value) return [];
  
  const query = searchQuery.value.toLowerCase();
  return posts.value.filter(post => 
    post.title.toLowerCase().includes(query) || 
    post.excerpt.toLowerCase().includes(query)
  ).slice(0, 5); // Limit to 5 results
});

watch(searchQuery, () => {
  activeIndex.value = 0;
});

function handleClickOutside(event) {
  const searchElement = document.querySelector('.search-container');
  if (!event.target.closest('.search-container')) {
    showResults.value = false;
  }
}

function hideResults() {
  showResults.value = false;
  searchQuery.value = '';
}

function navigateResults(direction) {
  if (!filteredPosts.value.length) return;
  
  if (direction === 'down') {
    activeIndex.value = (activeIndex.value + 1) % filteredPosts.value.length;
  } else {
    activeIndex.value = activeIndex.value === 0 
      ? filteredPosts.value.length - 1 
      : activeIndex.value - 1;
  }
}

function selectResult() {
  if (filteredPosts.value.length && activeIndex.value >= 0) {
    goToPost(filteredPosts.value[activeIndex.value].slug);
  }
}

function goToPost(slug) {
  router.push(`/blog/${slug}`);
  hideResults();
}
</script> 