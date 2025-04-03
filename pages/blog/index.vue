<template>
  <div>
    <div class="jp-container">
      <!-- Blog Header -->
      <div class="mb-12 max-w-3xl mx-auto text-center">
        <h1 class="text-3xl md:text-4xl font-medium mb-5 text-primary-950 dark:text-primary-50 tracking-wider">
          Climate Change <span class="text-primary-600 dark:text-primary-400">Blog</span>
        </h1>
        <div class="jp-divider w-24 my-5 mx-auto"></div>
        <p class="text-muted-foreground md:text-lg">
          The latest research, insights, and solutions on climate change.
        </p>
      </div>

      <!-- Filter and Search Section -->
      <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div class="flex flex-wrap gap-2">
          <button 
            @click="selectedCategory = null" 
            :class="[
              'px-3 py-1.5 text-sm transition-colors rounded-none border',
              !selectedCategory 
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'border-primary-200 dark:border-primary-700 hover:border-primary-400 text-foreground'
            ]"
          >
            All Posts
          </button>
          <button 
            v-for="category in categories" 
            :key="category.id"
            @click="selectedCategory = category.id"
            :class="[
              'px-3 py-1.5 text-sm transition-colors rounded-none border',
              selectedCategory === category.id
                ? 'bg-primary-600 text-white border-primary-600' 
                : 'border-primary-200 dark:border-primary-700 hover:border-primary-400 text-foreground'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
        <div class="w-full md:w-64">
          <SearchBar />
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-20 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-muted-foreground">Loading posts...</p>
      </div>

      <!-- Blog Grid -->
      <div v-else-if="filteredPosts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <PostCard 
          v-for="post in filteredPosts" 
          :key="post.id" 
          :post="post" 
          :category="getCategoryName(post.categoryId)"
        />
      </div>

      <!-- No Results -->
      <div v-else class="py-16 text-center border border-primary-100 dark:border-primary-800 bg-card">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="text-xl font-medium mb-2">No posts found</h3>
        <p class="text-muted-foreground">Try changing your filter criteria.</p>
      </div>

      <!-- Pagination (if needed in the future) -->
      <!-- <div class="flex justify-center mt-8">
        <button class="px-4 py-2 mr-2 border border-primary-200 dark:border-primary-700 hover:border-primary-400">Previous</button>
        <button class="px-4 py-2 border border-primary-200 dark:border-primary-700 hover:border-primary-400">Next</button>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const posts = ref([]);
const categories = ref([]);
const loading = ref(true);
const selectedCategory = ref(null);
const { getPosts, getCategories } = useFirestore();

// Get all posts and categories on mount
onMounted(async () => {
  try {
    // Fetch both posts and categories in parallel
    const [postsData, categoriesData] = await Promise.all([
      getPosts(),
      getCategories()
    ]);
    
    // Sort posts by date (newest first)
    posts.value = postsData.sort((a, b) => {
      return b.publishedAt.seconds - a.publishedAt.seconds;
    });
    
    categories.value = categoriesData;
  } catch (error) {
    console.error('Error fetching blog data:', error);
  } finally {
    loading.value = false;
  }
});

// Filter posts based on selected category
const filteredPosts = computed(() => {
  if (!selectedCategory.value) {
    return posts.value;
  }
  return posts.value.filter(post => post.categoryId === selectedCategory.value);
});

// Get category name by ID
const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId);
  return category ? category.name : '';
};
</script> 