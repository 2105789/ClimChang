<template>
  <article 
    class="bg-card border border-primary-100/80 dark:border-primary-800/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
  >
    <div class="relative aspect-video overflow-hidden">
      <img 
        :src="post.imageUrl" 
        :alt="post.title" 
        class="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-primary-950/30 to-transparent"></div>
      <div class="absolute bottom-3 left-3">
        <span 
          class="inline-block bg-primary-600/90 px-2 py-1 text-xs text-white backdrop-blur-sm"
        >
          {{ category }}
        </span>
      </div>
    </div>
    <div class="p-5">
      <div class="flex justify-end mb-2">
        <span class="text-xs text-muted-foreground">
          {{ formatDate(post.publishedAt) }}
        </span>
      </div>
      
      <h3 class="text-lg font-medium mb-2 line-clamp-2 tracking-tight">
        <NuxtLink :to="`/blog/${post.slug}`" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          {{ post.title }}
        </NuxtLink>
      </h3>
      
      <p class="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
        {{ post.excerpt }}
      </p>
      
      <NuxtLink 
        :to="`/blog/${post.slug}`" 
        class="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
      >
        Read more
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </NuxtLink>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  category: {
    type: String,
    required: true
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