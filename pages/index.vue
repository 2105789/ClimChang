<template>
  <div>
    <!-- Hero section - Japanese-inspired minimalist design -->
    <section class="py-20 mb-16">
      <div class="jp-container">
        <div class="max-w-2xl mx-auto">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 class="text-4xl md:text-5xl font-medium mb-6 text-primary-950 dark:text-primary-50 tracking-wider">
              Climate <span class="text-primary-600 dark:text-primary-400">Change</span>
            </h1>
            <div class="jp-divider w-24 my-5"></div>
            <p class="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl mx-auto">
              Exploring the science, impacts, and solutions to our planet's most pressing challenge.
            </p>
          </div>
          <div class="flex items-center justify-center gap-6 flex-wrap">
            <NuxtLink 
              to="/category/science-research" 
              class="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white transition-colors rounded-md"
            >
              Research
            </NuxtLink>
            <NuxtLink 
              to="/category/sustainability-solutions" 
              class="px-6 py-2.5 bg-transparent hover:bg-primary-50 dark:hover:bg-primary-900/40 border border-primary-200 dark:border-primary-700 text-primary-950 dark:text-primary-200 transition-colors rounded-md"
            >
              Solutions
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Latest Posts Section -->
    <section class="mb-20">
      <div class="jp-container rounded-md">
        <div class="flex items-center justify-between mb-10">
          <h2 class="text-2xl font-medium text-primary-950 dark:text-primary-100 flex items-center">
            <span class="bg-primary-600 text-white p-1.5 mr-3 inline-block rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </span>
            Latest Posts
          </h2>
          <NuxtLink 
            to="/blog" 
            class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center"
          >
            View all
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </NuxtLink>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <template v-if="posts.length">
            <PostCard 
              v-for="post in posts" 
              :key="post.id" 
              :post="post" 
              :category="getCategoryName(post.categoryId)"
            />
          </template>
          <template v-else>
            <div v-for="i in 6" :key="i" class="bg-card animate-pulse border border-primary-100/50 dark:border-primary-800/50 h-80 rounded-md"></div>
          </template>
        </div>
      </div>
    </section>
    
    <!-- Categories Section -->
    <section class="mb-16">
      <div class="jp-container">
        <div class="mb-10">
          <h2 class="text-2xl font-medium text-primary-950 dark:text-primary-100 flex items-center">
            <span class="bg-primary-600 text-white p-1.5 mr-3 inline-block rounded-md">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </span>
            Explore Topics
          </h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <NuxtLink 
            v-for="category in categories" 
            :key="category.id" 
            :to="`/category/${category.slug}`"
            class="bg-card p-6 border border-primary-100/80 dark:border-primary-800/30 hover:border-primary-400 dark:hover:border-primary-600 transition-all duration-300 group rounded-md"
          >
            <h3 class="text-lg mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {{ category.name }}
            </h3>
            <p class="text-sm text-muted-foreground line-clamp-3">
              {{ category.description }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const posts = ref([]);
const categories = ref([]);
const { getPosts, getCategories } = useFirestore();

onMounted(async () => {
  // Fetch posts and categories
  const [postsData, categoriesData] = await Promise.all([
    getPosts(),
    getCategories()
  ]);
  
  // Sort posts by date (newest first)
  posts.value = postsData.sort((a, b) => {
    return b.publishedAt.seconds - a.publishedAt.seconds;
  }).slice(0, 6); // Limit to 6 posts on homepage
  
  categories.value = categoriesData;
});

const getCategoryName = (categoryId) => {
  const category = categories.value.find(cat => cat.id === categoryId);
  return category ? category.name : '';
};
</script> 