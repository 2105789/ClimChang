<template>
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <header class="mb-10">
        <h1 class="text-3xl md:text-4xl font-bold mb-4">Firestore Debug</h1>
        <p class="text-muted-foreground max-w-3xl mb-6">
          This page helps diagnose Firestore connection and data structure issues.
        </p>
        
        <div class="flex flex-wrap gap-4">
          <button 
            @click="verifyCollection" 
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Verify Collection
          </button>
          
          <button 
            @click="fetchAllArticles" 
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Fetch All Articles
          </button>
          
          <button 
            @click="testIndexes" 
            class="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Test Indexes
          </button>
        </div>
      </header>
      
      <div v-if="loading" class="flex justify-center items-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
      
      <div v-else>
        <div v-if="result">
          <h2 class="text-xl font-semibold mb-4">Results:</h2>
          
          <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto mb-8 max-h-[600px]">
            <pre class="text-xs">{{ JSON.stringify(result, null, 2) }}</pre>
          </div>
          
          <div v-if="error" class="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md mb-8">
            <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Error:</h3>
            <p class="text-red-600 dark:text-red-400">{{ error }}</p>
          </div>
          
          <div v-if="domainStats.length > 0" class="mt-8">
            <h3 class="text-lg font-semibold mb-4">Domains Found:</h3>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse">
                <thead>
                  <tr class="bg-primary-100 dark:bg-primary-800">
                    <th class="border border-primary-200 dark:border-primary-700 px-4 py-2 text-left">Domain</th>
                    <th class="border border-primary-200 dark:border-primary-700 px-4 py-2 text-left">Count</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(domain, index) in domainStats" :key="index" class="hover:bg-primary-50 dark:hover:bg-primary-900/20">
                    <td class="border border-primary-200 dark:border-primary-700 px-4 py-2">{{ domain.name }}</td>
                    <td class="border border-primary-200 dark:border-primary-700 px-4 py-2">{{ domain.count }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { collection, query, orderBy, limit, where, getDocs } from 'firebase/firestore';

// Page meta
definePageMeta({
  layout: 'default'
});

const { $firebase } = useNuxtApp();
const { verifyArticlesCollection, fetchAllArticles: fetchAll } = useArticles();
const firestore = $firebase.firestore;

const result = ref(null);
const loading = ref(false);
const error = ref(null);
const domainStats = ref([]);

const verifyCollection = async () => {
  loading.value = true;
  error.value = null;
  result.value = null;
  domainStats.value = [];
  
  try {
    const verification = await verifyArticlesCollection();
    result.value = verification;
  } catch (err) {
    console.error('Error verifying collection:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const fetchAllArticles = async () => {
  loading.value = true;
  error.value = null;
  result.value = null;
  domainStats.value = [];
  
  try {
    const articles = await fetchAll();
    
    // Compute domain statistics
    const domains = {};
    articles.forEach(article => {
      const domain = article.source_domain;
      if (!domain) return;
      
      if (!domains[domain]) {
        domains[domain] = 0;
      }
      domains[domain]++;
    });
    
    const stats = Object.entries(domains).map(([name, count]) => ({ name, count }));
    stats.sort((a, b) => b.count - a.count);
    domainStats.value = stats;
    
    result.value = {
      totalArticles: articles.length,
      domains: Object.keys(domains).length,
      firstArticle: articles.length > 0 ? articles[0] : null,
      lastArticle: articles.length > 0 ? articles[articles.length - 1] : null
    };
  } catch (err) {
    console.error('Error fetching all articles:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

const testIndexes = async () => {
  loading.value = true;
  error.value = null;
  result.value = null;
  domainStats.value = [];
  
  const indexTests = [
    {
      name: 'Basic articles query',
      query: () => query(collection(firestore, 'articles'), limit(1))
    },
    {
      name: 'Query with timestamp ordering',
      query: () => query(collection(firestore, 'articles'), orderBy('timestamp', 'desc'), limit(1))
    },
    {
      name: 'Query with scraped_at ordering',
      query: () => query(collection(firestore, 'articles'), orderBy('scraped_at', 'desc'), limit(1))
    },
    {
      name: 'Query with domain filter',
      query: () => query(collection(firestore, 'articles'), where('source_domain', '==', 'orfonline.org'), limit(1))
    },
    {
      name: 'Compound query with domain and timestamp',
      query: () => query(collection(firestore, 'articles'), where('source_domain', '==', 'orfonline.org'), orderBy('timestamp', 'desc'), limit(1))
    },
    {
      name: 'Compound query with domain and scraped_at',
      query: () => query(collection(firestore, 'articles'), where('source_domain', '==', 'orfonline.org'), orderBy('scraped_at', 'desc'), limit(1))
    }
  ];
  
  const results = [];
  
  try {
    for (const test of indexTests) {
      try {
        const testQuery = test.query();
        const snapshot = await getDocs(testQuery);
        
        results.push({
          test: test.name,
          success: true,
          count: snapshot.size,
          sample: snapshot.size > 0 ? snapshot.docs[0].data() : null
        });
      } catch (err) {
        results.push({
          test: test.name,
          success: false,
          error: err.message
        });
      }
    }
    
    result.value = results;
  } catch (err) {
    console.error('Error testing indexes:', err);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};
</script> 