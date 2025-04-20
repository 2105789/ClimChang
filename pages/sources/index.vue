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
      
      <!-- Website Filter Section -->
      <div class="mb-10 max-w-7xl mx-auto">
        <div class="flex flex-col space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-medium">
              Filter Sources
              <span v-if="selectedDomains.length > 0" class="ml-2 px-2 py-0.5 text-xs rounded-full bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200">
                {{ selectedDomains.length }} selected
              </span>
            </h3>
            <button 
              @click="clearAllFilters" 
              class="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300 transition-colors"
              v-if="selectedDomains.length > 0"
            >
              Clear all filters
            </button>
          </div>
          
          <!-- Search box for domains -->
          <div class="relative">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              type="text" 
              v-model="domainSearch" 
              placeholder="Search sources..." 
              class="w-full p-2 pl-10 text-sm border border-gray-200 dark:border-gray-700 rounded-md bg-background focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div class="flex flex-wrap gap-2">
            <button 
              v-if="selectedDomains.length === 0"
              class="px-3 py-1 text-sm bg-primary-50 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 rounded-full border border-primary-200 dark:border-primary-700"
              disabled
            >
              All sources ({{ allDomains.length }})
            </button>
            
            <transition-group name="filter-chip">
              <div v-for="domain in filteredDomainBubbles" :key="domain" class="inline-flex">
                <button 
                  @click="toggleDomainFilter(domain)"
                  class="px-3 py-1 text-sm rounded-full transition-colors flex items-center gap-2"
                  :class="isDomainSelected(domain) 
                    ? 'bg-primary-600 dark:bg-primary-700 text-white border border-primary-600 dark:border-primary-700' 
                    : 'bg-primary-50 dark:bg-primary-900/30 text-primary-800 dark:text-primary-200 border border-primary-200 dark:border-primary-700 hover:bg-primary-100 dark:hover:bg-primary-800/50'"
                >
                  {{ formatDomain(domain) }}
                  <span v-if="isDomainSelected(domain)" class="inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </span>
                </button>
              </div>
            </transition-group>
          </div>
        </div>
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
        <!-- No domains match filter message -->
        <div v-if="Object.keys(visibleDomains).length === 0 && !initialLoading && !error" class="text-center py-16">
          <div class="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="text-lg font-medium mb-2">No matching sources</h3>
          <p class="text-muted-foreground mb-6">
            {{ domainSearch ? 'No sources match your search criteria.' : 'No sources match your selected filters.' }}
          </p>
          <button
            @click="clearAllFilters"
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
        
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
                (<a 
                  :href="`https://${domain}`" 
                  target="_blank" 
                  class="text-primary-600 dark:text-primary-400 hover:underline"
                >{{ domain }}</a>)
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

// For filtering domains
const selectedDomains = ref([]);
const domainSearch = ref('');

const toggleDomainFilter = (domain) => {
  const index = selectedDomains.value.indexOf(domain);
  if (index === -1) {
    selectedDomains.value.push(domain);
  } else {
    selectedDomains.value.splice(index, 1);
  }
};

const isDomainSelected = (domain) => {
  return selectedDomains.value.includes(domain);
};

const clearAllFilters = () => {
  selectedDomains.value = [];
  domainSearch.value = '';
};

// Filter domain bubbles based on search
const filteredDomainBubbles = computed(() => {
  if (!domainSearch.value.trim()) {
    return allDomains.value;
  }
  
  const searchTerm = domainSearch.value.toLowerCase();
  return allDomains.value.filter(domain => {
    // Check if the domain matches the search term
    return domain.toLowerCase().includes(searchTerm) || 
           formatDomain(domain).toLowerCase().includes(searchTerm);
  });
});

// For handling empty results
const hasFilteredResults = computed(() => {
  return Object.keys(visibleDomains.value).length > 0;
});

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

// Number of articles to show per domain
const articlesPerDomain = 6;
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
  // Filter domains first if any are selected
  let filteredDomains = [...allDomains.value];
  if (selectedDomains.value.length > 0) {
    filteredDomains = filteredDomains.filter(domain => selectedDomains.value.includes(domain));
  }
  
  // Sort domains by the most recent article in each domain
  const domainsByRecency = filteredDomains.sort((a, b) => {
    const articlesA = articlesBySource.value[a] || [];
    const articlesB = articlesBySource.value[b] || [];
    
    // Get the most recent article from each domain
    const mostRecentA = articlesA.length > 0 ? articlesA[0] : null;
    const mostRecentB = articlesB.length > 0 ? articlesB[0] : null;
    
    // If either domain has no articles, prioritize the one with articles
    if (!mostRecentA) return 1;
    if (!mostRecentB) return -1;
    
    // Sort by most recent article (newest first)
    const timeA = getTimeValue(mostRecentA);
    const timeB = getTimeValue(mostRecentB);
    return timeB - timeA;
  });
  
  const result = {};
  
  domainsByRecency.forEach(domain => {
    if (articlesBySource.value[domain]) {
      // Ensure articles within each domain are sorted properly (newest first)
      const sortedArticles = [...articlesBySource.value[domain]].sort((a, b) => {
        return getTimeValue(b) - getTimeValue(a);
      });
      // Limit to the latest 6 articles per domain
      result[domain] = sortedArticles.slice(0, articlesPerDomain);
    } else {
      // Initialize with empty array if domain exists but articles aren't loaded yet
      result[domain] = [];
    }
  });
  
  return result;
});

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
      
      // Sort articles to ensure newest is first
      const sortedArticles = [...domainArticles].sort((a, b) => {
        return getTimeValue(b) - getTimeValue(a);
      });
      
      // Update the articlesBySource with the new data
      articlesBySource.value = {
        ...articlesBySource.value,
        [domain]: sortedArticles
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
          
          // Sort articles to ensure newest is first
          const sortedArticles = [...domainArticles].sort((a, b) => {
            return getTimeValue(b) - getTimeValue(a);
          });
          
          // Update the articlesBySource with the new data (limited to articlesPerDomain)
          articlesBySource.value = {
            ...articlesBySource.value,
            [domain]: sortedArticles
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
    
    // Fetch all articles by source, limited to articlesPerDomain per source
    console.log(`Fetching up to ${articlesPerDomain} latest articles per source`);
    const allArticlesBySource = await fetchLatestArticles(articlesPerDomain);
    
    // Make sure articles are sorted by date (newest first) in each domain
    const sortedArticlesBySource = {};
    for (const [domain, articles] of Object.entries(allArticlesBySource)) {
      sortedArticlesBySource[domain] = [...articles].sort((a, b) => {
        return getTimeValue(b) - getTimeValue(a);
      }).slice(0, articlesPerDomain); // Limit to articlesPerDomain
    }
    
    articlesBySource.value = sortedArticlesBySource;
    
    // Get domains and sort them by most recent article
    const domainsList = Object.keys(sortedArticlesBySource);
    const sortedDomains = domainsList.sort((a, b) => {
      const articlesA = sortedArticlesBySource[a] || [];
      const articlesB = sortedArticlesBySource[b] || [];
      
      const mostRecentA = articlesA.length > 0 ? articlesA[0] : null;
      const mostRecentB = articlesB.length > 0 ? articlesB[0] : null;
      
      if (!mostRecentA) return 1;
      if (!mostRecentB) return -1;
      
      const timeA = getTimeValue(mostRecentA);
      const timeB = getTimeValue(mostRecentB);
      return timeB - timeA;
    });
    
    allDomains.value = sortedDomains;
    
    // Mark all domains as loaded since we loaded all at once
    allDomains.value.forEach(domain => {
      loadedDomains.value.add(domain);
    });
    
    if (allDomains.value.length === 0) {
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
  console.log('Sources page mounted, fetching all domains with their latest articles');
  try {
    await fetchData();
    console.log(`Loaded ${allDomains.value.length} domains, each with up to ${articlesPerDomain} articles`);
  } catch (error) {
    console.error('Error in sources page initialization:', error);
  } finally {
    initialLoading.value = false;
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
.filter-chip-enter-active,
.filter-chip-leave-active {
  transition: all 0.3s ease;
}
.filter-chip-enter-from,
.filter-chip-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>