<template>
  
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Sources Header -->
      <div class="mb-12 max-w-3xl mx-auto text-center">
        <h1 class="text-3xl md:text-4xl font-medium mb-5 text-primary-950 dark:text-primary-50 tracking-wider">
          Climate Change <span class="text-primary-600 dark:text-primary-400">Sources</span>
        </h1>
        <div class="jp-divider w-24 my-5 mx-auto"></div>
        <p class="text-muted-foreground md:text-lg">
          Latest Updates from Climate News Sources
        </p>
      </div>
    <div class="max-w-7xl mx-auto">
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else-if="error" class="py-16 text-center">
        <p class="text-lg text-red-600 dark:text-red-400 mb-4">{{ error }}</p>
        <div v-if="debugInfo" class="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-md max-w-3xl mx-auto overflow-auto mb-6">
          <p class="font-semibold mb-2">Debug Information:</p>
          <pre class="text-xs">{{ JSON.stringify(debugInfo, null, 2) }}</pre>
        </div>
        
        <div class="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-lg max-w-2xl mx-auto">
          <h3 class="text-xl font-semibold mb-3 text-yellow-800 dark:text-yellow-300">Troubleshooting</h3>
          <ul class="list-disc list-inside space-y-2 text-left mb-4">
            <li>Check if your Firestore database has an "articles" collection</li>
            <li>Verify that your articles have the fields: <code>source_domain</code>, <code>timestamp</code>, etc.</li>
            <li>You may need to create a Firestore composite index</li>
          </ul>
          
          <a 
            href="https://console.firebase.google.com/project/_/firestore/indexes" 
            target="_blank"
            class="mt-4 inline-flex items-center justify-center px-5 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Create Firestore Index
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
      
      <div v-else>
        <div 
          v-for="(articles, domain) in visibleDomains" 
          :key="domain" 
          class="mb-16"
        >
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-semibold">
              {{ formatDomain(domain) }}
              <span class="text-sm font-normal text-muted-foreground ml-2">
                ({{ domain }})
              </span>
            </h2>
            <NuxtLink 
              :to="`/sources/${domain}`" 
              class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium transition-colors flex items-center"
            >
              View all articles
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </NuxtLink>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="article in articlesBySource[domain]" :key="article.id" class="h-full">
              <ClientOnly>
                <ArticleCard :article="article" />
              </ClientOnly>
            </div>
          </div>
        </div>
        
        <div v-if="hasMoreDomains" class="mb-10 text-center py-4">
          <button 
            @click="loadMoreDomains" 
            class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Load More Sources
          </button>
        </div>
        
        <div v-if="Object.keys(articlesBySource).length === 0" class="py-16 text-center">
          <p class="text-lg text-muted-foreground mb-4">No articles found. Please check back later.</p>
          
          <div v-if="collectionInfo" class="text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-md max-w-3xl mx-auto overflow-auto mt-8 mb-6">
            <p class="font-semibold mb-2">Collection Information:</p>
            <pre class="text-xs">{{ JSON.stringify(collectionInfo, null, 2) }}</pre>
          </div>
          
          <div class="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-6 rounded-lg max-w-2xl mx-auto">
            <h3 class="text-xl font-semibold mb-3 text-yellow-800 dark:text-yellow-300">Troubleshooting</h3>
            <ul class="list-disc list-inside space-y-2 text-left mb-4">
              <li>Check if your Firestore database has articles with the <code>source_domain</code> field populated</li>
              <li>Verify that your articles have the proper fields structure</li>
            </ul>
            
            <button 
              @click="refreshData" 
              class="mt-4 inline-flex items-center justify-center px-5 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Page meta
definePageMeta({
  layout: 'default'
});

const { fetchLatestArticles, verifyArticlesCollection, clearCache } = useArticles();
const articlesBySource = ref({});
const loading = ref(true);
const error = ref(null);
const debugInfo = ref(null);
const collectionInfo = ref(null);

// For pagination of domains
const domainsPerPage = 4;
const currentPage = ref(1);
const allDomains = ref([]);
const visibleDomains = computed(() => {
  // First, sort domains by the most recent article in each domain
  const domainsByRecency = [...allDomains.value].sort((a, b) => {
    const articlesA = articlesBySource.value[a] || [];
    const articlesB = articlesBySource.value[b] || [];
    
    // Get the most recent article from each domain (they should already be sorted)
    const mostRecentA = articlesA.length > 0 ? articlesA[0] : null;
    const mostRecentB = articlesB.length > 0 ? articlesB[0] : null;
    
    // If either domain has no articles, prioritize the one with articles
    if (!mostRecentA) return 1;
    if (!mostRecentB) return -1;
    
    // Helper function to get time value from an article
    const getTimeValue = (article) => {
      // First try publication_date
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
    
    // Sort by most recent article
    return getTimeValue(mostRecentB) - getTimeValue(mostRecentA);
  });
  
  // Then take a slice based on the current page
  const domains = domainsByRecency.slice(0, currentPage.value * domainsPerPage);
  const result = {};
  
  domains.forEach(domain => {
    if (articlesBySource.value[domain]) {
      result[domain] = articlesBySource.value[domain];
    }
  });
  
  return result;
});

const hasMoreDomains = computed(() => {
  return allDomains.value.length > currentPage.value * domainsPerPage;
});

const loadMoreDomains = () => {
  currentPage.value++;
};

const refreshData = async () => {
  loading.value = true;
  error.value = null;
  debugInfo.value = null;
  
  try {
    clearCache(); // Clear the cache to force a refresh
    await fetchData();
  } catch (err) {
    console.error('Error refreshing data:', err);
    error.value = `Error refreshing data: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

const fetchData = async () => {
  try {
    // First verify the collection exists and has data
    const verificationResult = await verifyArticlesCollection();
    collectionInfo.value = verificationResult;
    
    if (!verificationResult.exists) {
      error.value = "The articles collection doesn't exist in Firestore. Please make sure it's created.";
      debugInfo.value = { verification: verificationResult };
      return;
    }
    
    if (!verificationResult.hasData) {
      error.value = "The articles collection exists but doesn't contain any documents.";
      debugInfo.value = { verification: verificationResult };
      return;
    }
    
    // If verification passed, fetch the articles
    articlesBySource.value = await fetchLatestArticles(6);
    
    // Get all domains - they'll be sorted by visibleDomains computed property
    allDomains.value = Object.keys(articlesBySource.value);
    
    if (allDomains.value.length === 0) {
      // No error, but no articles found
      debugInfo.value = { 
        verification: verificationResult,
        message: "The articles collection has data, but no articles could be retrieved with the current query."
      };
    }
  } catch (err) {
    console.error('Error loading articles:', err);
    error.value = `Error loading articles: ${err.message}`;
    debugInfo.value = { error: err.message, stack: err.stack };
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