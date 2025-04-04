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
          <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ formatDomain(domain) }}</h1>
          <p class="text-muted-foreground">
            <a 
              :href="sourceUrl" 
              target="_blank" 
              class="text-primary-600 dark:text-primary-400 hover:underline"
            >
              {{ domain }}
            </a>
          </p>
        </header>
      </div>
      
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else>
        <div v-if="articles.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="(article, index) in visibleArticles" :key="article.id" class="h-full">
              <ClientOnly>
                <ArticleCard :article="article" />
              </ClientOnly>
            </div>
          </div>
          
          <div v-if="hasMoreArticles" class="mt-10 mb-10 text-center py-4">
            <button 
              @click="loadMoreArticles" 
              class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Load More Articles
            </button>
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

const { fetchArticlesBySource, clearCache } = useArticles();

// Page meta
definePageMeta({
  layout: 'default'
});

// For pagination
const articlesPerPage = 12;
const currentPage = ref(1);
const visibleArticles = computed(() => {
  return articles.value.slice(0, currentPage.value * articlesPerPage);
});

const hasMoreArticles = computed(() => {
  return articles.value.length > currentPage.value * articlesPerPage;
});

const loadMoreArticles = () => {
  currentPage.value++;
};

const refreshData = async () => {
  loading.value = true;
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
    // Fetch articles which will be sorted by the useArticles composable
    let fetchedArticles = await fetchArticlesBySource(domain.value);
    
    // Double-check sorting to ensure newest articles appear first
    // This is a safety measure in case the composable sorting isn't working
    fetchedArticles.sort((a, b) => {
      // Helper function to get a comparable date value
      const getDateValue = (article) => {
        // Try publication_date first (most reliable for actual publish date)
        if (article.publication_date) {
          return new Date(article.publication_date).getTime();
        }
        
        // Then try timestamp
        if (article.timestamp) {
          if (article.timestamp.seconds) {
            return article.timestamp.seconds * 1000;
          }
          return new Date(article.timestamp).getTime();
        }
        
        // Then try scraped_at
        if (article.scraped_at) {
          if (article.scraped_at.seconds) {
            return article.scraped_at.seconds * 1000;
          }
          return new Date(article.scraped_at).getTime();
        }
        
        // Fallback to publication_date_raw
        if (article.publication_date_raw) {
          return new Date(article.publication_date_raw).getTime();
        }
        
        return 0;
      };
      
      // Sort newest first
      return getDateValue(b) - getDateValue(a);
    });
    
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
  
  // Remove www. if present and the TLD
  let formattedDomain = domain.replace(/^www\./, '');
  const parts = formattedDomain.split('.');
  if (parts.length > 1) {
    return parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
  }
  return formattedDomain;
};
</script>

<style scoped>
/* Add any page-specific styles here */
</style> 