<template>
    <article
      class="bg-card border border-primary-100/80 dark:border-primary-800/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 rounded-md h-full flex flex-col"
    >
      <!-- Use the computed property 'showImage' to decide whether to render the image block -->
      <template v-if="showImage">
        <NuxtLink :to="`/sources/${article.source_domain}`" class="block flex-shrink-0">
          <div class="relative aspect-video overflow-hidden">
            <img
              v-if="article.image_url"
              :src="article.image_url"
              :alt="article.title"
              class="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
              loading="lazy"
              @error="onImageError"
            />
            <div v-else class="w-full h-full bg-primary-100 dark:bg-primary-800/50 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary-300 dark:text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-primary-950/30 to-transparent"></div>
            <div class="absolute bottom-3 left-3">
              <span
                class="inline-block bg-primary-600/90 px-2 py-1 text-xs text-white backdrop-blur-sm rounded-sm"
              >
                {{ formatDomain(article.source_domain) }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </template>
  
      <div class="p-5 flex-1 flex flex-col">
        <div class="flex justify-between items-center mb-2">
          <!-- Show the source badge here ONLY if the image is NOT shown -->
          <span
            v-if="!showImage"
            class="inline-block bg-primary-600/90 px-2 py-1 text-xs text-white backdrop-blur-sm rounded-sm"
          >
            {{ formatDomain(article.source_domain) }}
          </span>
          <span class="text-xs text-muted-foreground ml-auto">
            {{ formatDate(article.publication_date) }}
          </span>
        </div>
  
        <h3 class="text-lg font-medium mb-2 line-clamp-2 tracking-tight">
          <a :href="article.article_url" target="_blank" class="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
            {{ article.title || 'Untitled Article' }}
          </a>
        </h3>
  
        <div class="mt-auto pt-4">
          <div class="flex items-center justify-between">
            <a
              :href="article.article_url"
              target="_blank"
              class="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
            >
              Read article
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
            <NuxtLink
              :to="`/sources/${article.source_domain}`"
              class="text-xs text-muted-foreground hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              More from this source
            </NuxtLink>
          </div>
        </div>
      </div>
    </article>
  </template>
  
  <script setup>
  import { computed, ref } from 'vue'; // Added ref for image error handling
  
  const props = defineProps({
    article: {
      type: Object,
      required: true
    }
  });
  
  // Define the specific SVG prefix to check against
  const svgDataUrlPrefix = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'";
  const gifDataUrlPrefix = "data:image/gif;base64,";
  
  // Track image loading errors
  const imageError = ref(false);
  
  // Handle image loading errors
  const onImageError = () => {
    imageError.value = true;
  };
  
  // Computed property to determine if a valid, non-SVG data URL image should be shown
  const showImage = computed(() => {
    const imageUrl = props.article.image_url;
    // Return false if there's an error or if the image URL doesn't exist or is an SVG
    return !imageError.value && !!imageUrl && !imageUrl.startsWith(svgDataUrlPrefix) && !imageUrl.startsWith(gifDataUrlPrefix);
  });
  
  const formatDomain = (domain) => {
    if (!domain) return '';
  
    // Remove www. if present and the TLD
    let formattedDomain = domain.replace(/^www\./, '');
    const parts = formattedDomain.split('.');
    if (parts.length > 1) {
      // Capitalize only the first letter of the first part (domain name)
      return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
    // Fallback if splitting didn't work as expected (e.g., 'localhost')
    return formattedDomain.charAt(0).toUpperCase() + formattedDomain.slice(1);
  };
  
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
  
    try {
      // Handle different date formats robustly
      let date;
      // Attempt to parse directly, works for ISO and many common formats
      date = new Date(dateStr);
  
      // Check if the date is valid after parsing
      if (isNaN(date.getTime())) {
          // Optional: Add more specific parsing logic if needed for tricky formats
          // console.warn(`Could not parse date: ${dateStr}`);
          return dateStr; // Return original string if parsing fails
      }
  
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (e) {
      console.error(`Error formatting date: ${dateStr}`, e);
      return dateStr; // Return the original string if any error occurs
    }
  };
  </script>