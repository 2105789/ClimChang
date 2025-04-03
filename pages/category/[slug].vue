<template>
  <div>
    <div class="jp-container">
      <!-- Loading State -->
      <div v-if="loading" class="py-20 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
        <p class="mt-4 text-muted-foreground">Loading category...</p>
      </div>
      
      <!-- Category Content -->
      <div v-else-if="category">
        <!-- Category Header -->
        <div class="mb-12 max-w-3xl mx-auto text-center">
          <h1 class="text-3xl md:text-4xl font-medium mb-5 text-primary-950 dark:text-primary-50 tracking-wider">
            {{ category.name }}
          </h1>
          <div class="jp-divider w-24 my-5 mx-auto"></div>
          <p class="text-muted-foreground md:text-lg">
            {{ category.description }}
          </p>
        </div>

        <!-- Filter and Search Section -->
        <div class="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div class="flex flex-wrap gap-2">
            <NuxtLink 
              to="/blog" 
              class="px-3 py-1.5 text-sm transition-colors rounded-none border border-primary-200 dark:border-primary-700 hover:border-primary-400 text-foreground"
            >
              All Posts
            </NuxtLink>
            <NuxtLink 
              v-for="cat in relatedCategories" 
              :key="cat.id"
              :to="`/category/${cat.slug}`" 
              :class="[
                'px-3 py-1.5 text-sm transition-colors rounded-none border',
                cat.id === category.id
                  ? 'bg-primary-600 text-white border-primary-600' 
                  : 'border-primary-200 dark:border-primary-700 hover:border-primary-400 text-foreground'
              ]"
            >
              {{ cat.name }}
            </NuxtLink>
          </div>
          <div class="w-full md:w-64">
            <SearchBar />
          </div>
        </div>

        <!-- Post Loading State -->
        <div v-if="loadingPosts" class="py-20 text-center">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto"></div>
          <p class="mt-4 text-muted-foreground">Loading posts...</p>
        </div>
        
        <!-- Posts Grid -->
        <div v-else-if="posts.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <PostCard 
            v-for="post in posts" 
            :key="post.id" 
            :post="post" 
            :category="category.name"
          />
        </div>
        
        <!-- No Posts Found -->
        <div v-else class="py-16 text-center border border-primary-100 dark:border-primary-800 bg-card mb-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-medium mb-2">No posts in this category</h3>
          <p class="text-muted-foreground">We're working on adding more content to this category soon!</p>
          
          <div class="mt-8 flex justify-center">
            <NuxtLink to="/blog" class="px-4 py-2 border border-primary-200 dark:border-primary-700 hover:border-primary-400 transition-all">
              Explore all posts
            </NuxtLink>
          </div>
          
          <button 
            v-if="!showDebug" 
            @click="showDebug = true" 
            class="mt-6 text-xs text-muted-foreground/60 hover:text-muted-foreground underline"
          >
            Show technical details
          </button>
          <div v-if="showDebug" class="mt-6 p-4 bg-card border border-primary-100 dark:border-primary-800 rounded text-left text-xs mx-auto max-w-xl">
            <p class="font-medium">Technical Details:</p>
            <p>Category ID: {{ category.id }}</p>
            <div v-if="debugInfo" class="mt-2">
              <p class="font-medium mt-2">Category-Post Distribution:</p>
              <div v-for="(item, i) in debugInfo.postsByCategoryId" :key="i" class="mt-1">
                <p>{{ item.categoryName }} ({{ item.categoryId }}): {{ item.count }} posts</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Related Categories Section -->
        <div v-if="otherCategories.length" class="mb-16">
          <div class="jp-divider mb-12"></div>
          <h2 class="text-2xl font-medium text-primary-950 dark:text-primary-100 mb-8 flex items-center">
            <span class="bg-primary-600 text-white p-1.5 mr-3 inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </span>
            Explore Other Topics
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <NuxtLink 
              v-for="cat in otherCategories" 
              :key="cat.id" 
              :to="`/category/${cat.slug}`"
              class="bg-card p-6 border border-primary-100/80 dark:border-primary-800/30 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-300 group"
            >
              <h3 class="text-lg mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {{ cat.name }}
              </h3>
              <p class="text-sm text-muted-foreground line-clamp-3">
                {{ cat.description }}
              </p>
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <!-- Category Not Found -->
      <div v-else class="py-20 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-muted-foreground mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-medium mb-3">Category not found</h2>
        <p class="text-muted-foreground">The category "{{ slug }}" does not exist.</p>
        <div class="mt-8">
          <NuxtLink to="/blog" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-none">
            Browse all blog posts
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const route = useRoute();
const { slug } = route.params;

const posts = ref([]);
const categories = ref([]);
const category = ref(null);
const debugInfo = ref(null);
const showDebug = ref(false);
const loading = ref(true);
const loadingPosts = ref(false);
const { getCategories, getPostsByCategory, getPosts } = useFirestore();

// Related categories (excludes current category)
const otherCategories = computed(() => {
  if (!category.value) return [];
  return categories.value.filter(cat => cat.id !== category.value.id);
});

// Get the top 5 related categories to show in the filter bar
const relatedCategories = computed(() => {
  if (!category.value) return [];
  return [category.value, ...otherCategories.value.slice(0, 4)];
});

// Function to parse Firestore data
function inspectFirestoreData(cats, allPosts) {
  // Group posts by categoryId and count them
  const postsByCategoryId = cats.map(cat => {
    const postsInCategory = allPosts.filter(p => p.categoryId === cat.id);
    return {
      categoryId: cat.id,
      categoryName: cat.name,
      count: postsInCategory.length
    };
  });

  return { postsByCategoryId };
}

onMounted(async () => {
  try {
    loading.value = true;
    
    // Get all categories
    categories.value = await getCategories();
    
    // Find the current category by slug
    category.value = categories.value.find(cat => cat.slug === slug);
    
    if (category.value) {
      // Get all posts for debugging
      loadingPosts.value = true;
      const allPosts = await getPosts();
      debugInfo.value = inspectFirestoreData(categories.value, allPosts);
      
      // Fetch posts for this category
      try {
        posts.value = await getPostsByCategory(category.value.id);
        
        // If no posts found, try a direct filtering approach
        if (posts.value.length === 0) {
          // Check for exact matches
          const exactMatches = allPosts.filter(p => p.categoryId === category.value.id);
          
          // Try trimming in case there are whitespace issues
          const trimmedMatches = allPosts.filter(p => 
            p.categoryId && p.categoryId.trim() === category.value.id.trim()
          );
          
          // If we found posts with direct filtering but Firebase query returned none,
          // use the direct filtering results as a fallback
          if (exactMatches.length > 0) {
            posts.value = exactMatches;
          } else if (trimmedMatches.length > 0) {
            posts.value = trimmedMatches;
          }
        }
      } finally {
        loadingPosts.value = false;
      }
    }
  } catch (error) {
    console.error('Error loading category page:', error);
  } finally {
    loading.value = false;
  }
});
</script> 