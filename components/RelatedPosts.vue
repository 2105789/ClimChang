<template>
  <div class="mt-10 pt-10 border-t border-border">
    <h2 class="text-2xl font-bold mb-6 flex items-center">
      <span class="bg-primary-100 dark:bg-primary-800 p-2 rounded-lg mr-3">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-primary-700 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </span>
      Related Posts
    </h2>
    <div v-if="loading" class="py-10 flex justify-center items-center">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-700"></div>
    </div>
    <div v-else-if="relatedPosts.length" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <article 
        v-for="post in relatedPosts" :key="post.id" 
        class="card bg-card rounded-lg border border-border overflow-hidden shadow-card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      >
        <div class="relative aspect-video group">
          <img 
            :src="post.imageUrl" 
            :alt="post.title" 
            class="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <div class="p-4">
          <h3 class="text-lg font-bold mb-2 line-clamp-2">
            <NuxtLink :to="`/blog/${post.slug}`" class="hover:text-primary-700 dark:hover:text-primary-400 transition-colors">
              {{ post.title }}
            </NuxtLink>
          </h3>
          <p class="text-sm text-muted-foreground line-clamp-2 mb-3">
            {{ post.excerpt }}
          </p>
          <div class="flex items-center justify-between">
            <span class="text-xs text-muted-foreground bg-accent/50 px-2 py-1 rounded">
              {{ formatDate(post.publishedAt) }}
            </span>
            <NuxtLink :to="`/blog/${post.slug}`" class="text-primary-700 dark:text-primary-400 text-sm font-medium flex items-center">
              Read
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NuxtLink>
          </div>
        </div>
      </article>
    </div>
    <div v-else class="p-8 text-center rounded-lg border border-border bg-card">
      <p class="text-muted-foreground">No related posts found in this category.</p>
      <p class="text-sm text-muted-foreground mt-2">Check out other categories for more content.</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  relatedPosts: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp.seconds * 1000);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};
</script> 