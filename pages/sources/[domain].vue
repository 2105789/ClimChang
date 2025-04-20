<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <NuxtLink 
          to="/sources" 
          class="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors mb-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
          Back to all sources
        </NuxtLink>
        
        <header class="mb-6">
          <h1 class="text-3xl md:text-4xl font-bold mb-4">
            {{ formatDomain(domain) }}
            <span class="text-xl font-normal text-muted-foreground ml-2">
              (<a 
                :href="sourceUrl" 
                target="_blank" 
                class="text-primary-600 dark:text-primary-400 hover:underline"
              >{{ domain }}</a>)
            </span>
          </h1>
        </header>
      </div>
      
      <div v-if="loading" class="py-8">
        <!-- Loading skeleton placeholders -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <ArticleSkeleton v-for="i in 6" :key="`skeleton-${i}`" />
        </div>
      </div>
      
      <div v-else>
        <div v-if="articles.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="(article, index) in visibleArticles" 
              :key="article.id" 
              class="h-full"
              v-intersection="index === visibleArticles.length - 3 ? { handler: onScrollNearEnd, options: { rootMargin: '300px' } } : null"
            >
              <ClientOnly>
                <ArticleCard :article="article" />
              </ClientOnly>
            </div>
          </div>
          
          <div v-if="hasMoreArticles && !loadingMore" class="mt-10 mb-10 text-center py-4">
            <button 
              @click="loadMoreArticles" 
              class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Load More Articles
            </button>
          </div>
          
          <div v-else-if="loadingMore" class="mt-10 mb-10 flex justify-center py-4">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        </div>
        
        <div v-else class="py-16 text-center">
          <p class="text-lg text-muted-foreground">No articles found from this source. Please check back later.</p>
          
          <button 
            @click="refreshData" 
            class="mt-8 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute();
const domain = ref(route.params.domain);
const sourceUrl = ref('');
const articles = ref([]);
const loading = ref(true);
const loadingMore = ref(false);

const { fetchArticlesBySource, clearCache } = useArticles();

// Page meta
definePageMeta({
  layout: 'default'
});

// Create a v-intersection directive to handle infinite scrolling
const vIntersection = {
  mounted(el, binding) {
    // Skip if no binding value (null check for conditional v-intersection)
    if (!binding.value) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          binding.value.handler();
        }
      });
    }, binding.value.options || {});
    
    observer.observe(el);
    el._observer = observer;
  },
  unmounted(el) {
    if (el._observer) {
      el._observer.disconnect();
    }
  }
};

// For pagination (client-side pagination to avoid additional Firestore reads)
const articlesPerPage = 12;
const currentPage = ref(1);
const visibleArticles = computed(() => {
  return articles.value.slice(0, currentPage.value * articlesPerPage);
});

const hasMoreArticles = computed(() => {
  return articles.value.length > currentPage.value * articlesPerPage;
});

const loadMoreArticles = () => {
  if (loadingMore.value) return;
  
  loadingMore.value = true;
  setTimeout(() => {
    currentPage.value++;
    loadingMore.value = false;
  }, 500); // Small delay for better UX
};

// Auto-load more articles when user scrolls near the end
const onScrollNearEnd = () => {
  if (hasMoreArticles.value && !loadingMore.value) {
    loadMoreArticles();
  }
};

const refreshData = async () => {
  loading.value = true;
  currentPage.value = 1;
  
  try {
    clearCache();
    await fetchData();
  } catch (error) {
    console.error('Error refreshing data:', error);
  } finally {
    loading.value = false;
  }
};

const fetchData = async () => {
  try {
    // Fetch articles using the optimized approach that utilizes caching
    const fetchedArticles = await fetchArticlesBySource(domain.value);
    
    // Articles are already sorted by the useArticles composable - no need to sort again
    articles.value = fetchedArticles;
    
    // Set the source URL from the first article if available
    if (articles.value.length > 0) {
      sourceUrl.value = articles.value[0].source_url || `https://${domain.value}`;
    } else {
      sourceUrl.value = `https://${domain.value}`;
    }
  } catch (error) {
    console.error('Error loading articles:', error);
  }
};

onMounted(async () => {
  try {
    await fetchData();
  } finally {
    loading.value = false;
  }
});

const formatDomain = (domain) => {
  if (!domain) return '';
  
  // Remove www. if present
  let formattedDomain = domain.replace(/^www\./, '');
  const parts = formattedDomain.split('.');
  
  // Special case handling for common subdomains
  if (parts.length > 2) {
    // For domains like blogs.worldbank.org, news.bbc.co.uk, etc.
    const firstPart = parts[0].toLowerCase();
    if (['blogs', 'blog', 'news', 'www2', 'ww2', 'climate', 'data'].includes(firstPart)) {
      return parts[1].charAt(0).toUpperCase() + parts[1].slice(1);
    }
  }
  
  if (parts.length > 1) {
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }
  return formattedDomain;
};
</script>

<style scoped>
/* Add any page-specific styles here */
</style>