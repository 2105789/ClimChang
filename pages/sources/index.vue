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
      <div v-if="initialLoading" class="py-8">
        <!-- Initial loading skeletons for a better user experience -->
        <div v-for="i in 2" :key="`domain-${i}`" class="mb-16">
          <div class="flex justify-between items-center mb-6">
            <div class="h-8 bg-primary-100 dark:bg-primary-800/30 w-48 rounded-md animate-pulse"></div>
            <div class="h-5 bg-primary-100 dark:bg-primary-800/30 w-32 rounded-md animate-pulse"></div>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ArticleSkeleton v-for="j in 3" :key="`article-${i}-${j}`" />
          </div>
        </div>
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
          v-intersection="{ handler: onDomainVisible, options: { rootMargin: '300px' } }"
          :data-domain="domain"
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
            <template v-if="domainLoading[domain]">
              <ArticleSkeleton v-for="i in 3" :key="`skeleton-${domain}-${i}`" />
            </template>
            <template v-else>
              <div v-for="article in articlesBySource[domain]" :key="article.id" class="h-full">
                <ClientOnly>
                  <ArticleCard :article="article" />
                </ClientOnly>
              </div>
            </template>
          </div>
        </div>
        
        <div v-if="hasMoreDomains" class="mb-10 text-center py-4">
          <button 
            @click="loadMoreDomains" 
            class="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            :disabled="loadingMoreDomains"
            :class="{'opacity-70 cursor-not-allowed': loadingMoreDomains}"
          >
            <span v-if="loadingMoreDomains" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Loading...
            </span>
            <span v-else>Load More Sources</span>
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

const { fetchLatestArticles, verifyArticlesCollection, clearCache, getAvailableDomains, fetchArticlesBySource } = useArticles();
const articlesBySource = ref({});
const initialLoading = ref(true);
const loading = ref(false); // Used for subsequent loading states
const error = ref(null);
const debugInfo = ref(null);
const collectionInfo = ref(null);
const loadingMoreDomains = ref(false);

// For lazy loading articles by domain
const domainLoading = ref({});
const loadedDomains = ref(new Set());

// Create a v-intersection directive to handle lazy loading
const vIntersection = {
  mounted(el, binding) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          binding.value.handler(el);
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

// For pagination of domains
const domainsPerPage = 4;
const currentPage = ref(1);
const allDomains = ref([]);

// Reuse getTimeValue helper function to ensure consistent sorting
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
    
    // Sort by most recent article
    return getTimeValue(mostRecentB) - getTimeValue(mostRecentA);
  });
  
  // Then take a slice based on the current page
  const domains = domainsByRecency.slice(0, currentPage.value * domainsPerPage);
  const result = {};
  
  domains.forEach(domain => {
    if (articlesBySource.value[domain]) {
      result[domain] = articlesBySource.value[domain];
    } else {
      // Initialize with empty array if domain exists but articles aren't loaded yet
      result[domain] = [];
    }
  });
  
  return result;
});

const hasMoreDomains = computed(() => {
  return allDomains.value.length > currentPage.value * domainsPerPage;
});

const loadMoreDomains = async () => {
  if (loadingMoreDomains.value) return;
  
  loadingMoreDomains.value = true;
  currentPage.value++;
  
  // Allow state to update and UI to show loading
  await nextTick();
  
  try {
    // Load the newly visible domains
    await loadVisibleDomainsData();
  } finally {
    loadingMoreDomains.value = false;
  }
};

// Handler for intersection observer - load domain data when section becomes visible
const onDomainVisible = async (el) => {
  const domain = el.dataset.domain;
  
  // Skip if this domain is already loading or loaded
  if (!domain || loadedDomains.value.has(domain) || domainLoading.value[domain]) {
    return;
  }
  
  // Mark this domain as loading
  domainLoading.value[domain] = true;
  
  try {
    // Check if we already have the domain data
    if (!articlesBySource.value[domain] || articlesBySource.value[domain].length === 0) {
      // Fetch articles for this specific domain
      const domainArticles = await fetchArticlesBySource(domain);
      
      // Update the articlesBySource with the new data
      articlesBySource.value = {
        ...articlesBySource.value,
        [domain]: domainArticles
      };
    }
    
    // Mark this domain as loaded
    loadedDomains.value.add(domain);
  } catch (err) {
    console.error(`Error loading articles for domain ${domain}:`, err);
  } finally {
    // Mark as no longer loading regardless of outcome
    domainLoading.value[domain] = false;
  }
};

// Load data for all currently visible domains
const loadVisibleDomainsData = async () => {
  const domains = Object.keys(visibleDomains.value);
  
  // First mark all unloaded domains as loading
  domains.forEach(domain => {
    if (!loadedDomains.value.has(domain)) {
      domainLoading.value[domain] = true;
    }
  });
  
  // Load domains in parallel
  await Promise.all(
    domains
      .filter(domain => !loadedDomains.value.has(domain))
      .map(async (domain) => {
        try {
          const domainArticles = await fetchArticlesBySource(domain);
          
          // Update the articlesBySource with the new data
          articlesBySource.value = {
            ...articlesBySource.value,
            [domain]: domainArticles
          };
          
          // Mark as loaded
          loadedDomains.value.add(domain);
        } catch (err) {
          console.error(`Error loading articles for domain ${domain}:`, err);
        } finally {
          domainLoading.value[domain] = false;
        }
      })
  );
};

const refreshData = async () => {
  initialLoading.value = true;
  error.value = null;
  debugInfo.value = null;
  
  try {
    clearCache(); // Clear the cache to force a refresh
    loadedDomains.value.clear(); // Reset loaded domains
    domainLoading.value = {}; // Reset loading states
    await fetchData();
  } catch (err) {
    console.error('Error refreshing data:', err);
    error.value = `Error refreshing data: ${err.message}`;
  } finally {
    initialLoading.value = false;
  }
};

const fetchData = async () => {
  try {
    // Only verify the collection if we need to
    if (!Object.keys(articlesBySource.value).length) {
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
    }
    
    // Get all available domains first (optimized to use cache)
    // This allows us to display the UI framework without loading all article data
    const domains = await getAvailableDomains();
    allDomains.value = domains || [];
    
    if (allDomains.value.length === 0) {
      // If no domains are available, try to get them from articles
      // This now uses a single optimized query with caching
      const allArticlesBySource = await fetchLatestArticles(6);
      articlesBySource.value = allArticlesBySource;
      allDomains.value = Object.keys(allArticlesBySource);
      
      // Mark all domains as loaded since we loaded all at once
      allDomains.value.forEach(domain => {
        loadedDomains.value.add(domain);
      });
    } else {
      // Initially, we just set up the domain structure without loading all articles
      // This provides a faster initial render and reduces Firestore reads
      const initialArticlesBySource = {};
      
      // Initialize articlesBySource with empty arrays for visible domains
      const visibleDomainsList = allDomains.value.slice(0, domainsPerPage);
      visibleDomainsList.forEach(domain => {
        initialArticlesBySource[domain] = [];
      });
      
      articlesBySource.value = initialArticlesBySource;
      
      // After initial render, load data for visible domains
      nextTick(() => {
        loadVisibleDomainsData();
      });
    }
    
    if (allDomains.value.length === 0 && domains?.length === 0) {
      // No error, but no articles found
      debugInfo.value = { 
        verification: collectionInfo.value,
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
    initialLoading.value = false;
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