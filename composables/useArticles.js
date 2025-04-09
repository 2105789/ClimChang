import { collection, query, orderBy, limit, where, getDocs, getFirestore, Timestamp } from 'firebase/firestore';

export const useArticles = () => {
  const { $firebase } = useNuxtApp();
  const firestore = $firebase.firestore;
  
  // Enhanced cache with longer duration and structured storage
  const articlesCache = {
    allArticles: null,
    byDomain: {},
    lastFetch: null,
    cacheDuration: 30 * 60 * 1000, // Increase to 30 minutes cache duration
    pendingFetches: {}, // Track in-flight promises to prevent duplicate requests
    structuredData: {
      domains: [], // Pre-computed domain list
    }
  };
  
  // Function to clear cache
  const clearCache = () => {
    articlesCache.allArticles = null;
    articlesCache.byDomain = {};
    articlesCache.lastFetch = null;
    articlesCache.structuredData = { domains: [] };
    articlesCache.pendingFetches = {};
  };
  
  // Check if cache is valid
  const isCacheValid = () => {
    if (!articlesCache.lastFetch) return false;
    
    const now = new Date().getTime();
    return (now - articlesCache.lastFetch) < articlesCache.cacheDuration;
  };
  
  // Helper function to log a document's structure (for debugging only)
  const logDocStructure = (doc) => {
    const data = doc.data();
    console.log('Document ID:', doc.id);
    console.log('Fields:', Object.keys(data));
    console.log('Sample data:', data);
  };
  
  // Check if the articles collection exists and has documents - Used only for debugging
  const verifyArticlesCollection = async () => {
    try {
      console.log('Verifying articles collection...');
      
      // Return from cache if we have existing articles
      if (articlesCache.allArticles && articlesCache.allArticles.length > 0) {
        return {
          exists: true,
          count: articlesCache.allArticles.length,
          hasData: true
        };
      }
      
      const articlesQuery = query(
        collection(firestore, 'articles'),
        limit(5)
      );
      
      const snapshot = await getDocs(articlesQuery);
      console.log(`Articles collection has ${snapshot.size} documents`);
      
      if (!snapshot.empty) {
        // Don't log in production to reduce console noise
        if (process.env.NODE_ENV === 'development') {
          console.log('Sample documents:');
          snapshot.forEach(doc => {
            logDocStructure(doc);
          });
        }
        return {
          exists: true,
          count: snapshot.size,
          hasData: true
        };
      } else {
        console.log('Articles collection exists but is empty');
        return {
          exists: true,
          count: 0,
          hasData: false
        };
      }
    } catch (error) {
      console.error('Error verifying articles collection:', error);
      return {
        exists: false,
        error: error.message
      };
    }
  };

  // Helper function to get timestamp from different date formats
  const getTimeValue = (article) => {
    // If article is null or undefined, return 0 (lowest priority)
    if (!article) return 0;
    
    // First try publication_date (since this is the actual publish date)
    if (article.publication_date) {
      if (typeof article.publication_date === 'string') {
        return new Date(article.publication_date).getTime();
      } else if (article.publication_date instanceof Timestamp) {
        return article.publication_date.toMillis();
      } else if (article.publication_date.seconds) {
        return article.publication_date.seconds * 1000;
      }
    }
    
    // Then try timestamp (server timestamp)
    if (article.timestamp) {
      if (article.timestamp instanceof Timestamp) {
        return article.timestamp.toMillis();
      } else if (article.timestamp.seconds) {
        return article.timestamp.seconds * 1000;
      } else if (typeof article.timestamp === 'string') {
        return new Date(article.timestamp).getTime();
      }
    }
    
    // Then try scraped_at
    if (article.scraped_at) {
      if (article.scraped_at instanceof Timestamp) {
        return article.scraped_at.toMillis();
      } else if (article.scraped_at.seconds) {
        return article.scraped_at.seconds * 1000;
      } else if (typeof article.scraped_at === 'string') {
        return new Date(article.scraped_at).getTime();
      }
    }
    
    // Fallback to publication_date_raw
    if (article.publication_date_raw) {
      return new Date(article.publication_date_raw).getTime();
    }
    
    // Last resort: return current time (so it doesn't get sorted to the very bottom)
    return Date.now();
  };

  // Optimized fetch all articles function with caching and deduplication
  const fetchAllArticles = async (forceRefresh = false) => {
    try {
      // Return from cache if valid and not forcing a refresh
      if (!forceRefresh && isCacheValid() && articlesCache.allArticles) {
        console.log('Returning all articles from cache');
        return articlesCache.allArticles;
      }
      
      // Check if we already have a fetch in progress
      if (articlesCache.pendingFetches['allArticles']) {
        console.log('Reusing in-progress fetch for all articles');
        return articlesCache.pendingFetches['allArticles'];
      }
      
      console.log('Fetching all articles without complex ordering');
      
      // Create a new promise and store in pendingFetches
      const fetchPromise = (async () => {
        // Add limit to reduce data transfer when we just need a sample
        // In production, we'd paginate instead of fetching everything
        const articlesQuery = query(
          collection(firestore, 'articles'),
          limit(500) // Reasonable limit to avoid excessive reads
        );
        
        const snapshot = await getDocs(articlesQuery);
        console.log(`Got ${snapshot.size} articles total`);
        
        const articles = [];
        
        snapshot.forEach(doc => {
          articles.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Update cache
        articlesCache.allArticles = articles;
        articlesCache.lastFetch = new Date().getTime();
        
        // Pre-compute data for better performance
        // Sort with newest first using our universal sorting logic
        articles.sort((a, b) => {
          const timeA = getTimeValue(a);
          const timeB = getTimeValue(b);
          return timeB - timeA; // newest first
        });
        
        // Pre-compute domains list
        const domains = new Set();
        articles.forEach(article => {
          if (article.source_domain) {
            domains.add(article.source_domain);
          }
        });
        
        articlesCache.structuredData.domains = Array.from(domains);
        
        // Clear this pending fetch
        delete articlesCache.pendingFetches['allArticles'];
        
        return articles;
      })();
      
      // Store the promise
      articlesCache.pendingFetches['allArticles'] = fetchPromise;
      
      return fetchPromise;
    } catch (error) {
      console.error('Error fetching all articles:', error);
      // Clean up pending fetch on error
      delete articlesCache.pendingFetches['allArticles']; 
      return [];
    }
  };
  
  // Optimized function to process articles by source (uses single Firestore query)
  const processArticlesBySource = async (limitPerSource = 6) => {
    try {
      // Check if we have the domain already cached with valid cache
      if (isCacheValid() && Object.keys(articlesCache.byDomain).length > 0) {
        console.log('Returning articles by source from cache');
        return articlesCache.byDomain;
      }
      
      // Check if we already have a fetch in progress
      if (articlesCache.pendingFetches['bySource']) {
        console.log('Reusing in-progress fetch for articles by source');
        return articlesCache.pendingFetches['bySource'];
      }
      
      // Create a new promise and store in pendingFetches
      const fetchPromise = (async () => {
        // Fetch all articles (this uses the cache if available)
        const allArticles = await fetchAllArticles();
        
        if (allArticles.length === 0) {
          return {};
        }
        
        // Group by source_domain
        const groupedByDomain = {};
        
        allArticles.forEach(article => {
          const domain = article.source_domain;
          if (!domain) return;
          
          if (!groupedByDomain[domain]) {
            groupedByDomain[domain] = [];
          }
          
          groupedByDomain[domain].push(article);
        });
        
        // Sort each group by date fields
        const result = {};
        
        for (const [domain, articles] of Object.entries(groupedByDomain)) {
          // Sort based on the composite date logic regardless of which field is present
          let sorted = [...articles];
          
          // Ensure articles are sorted with newest first
          sorted.sort((a, b) => {
            const timeA = getTimeValue(a);
            const timeB = getTimeValue(b);
            return timeB - timeA; // newest first
          });
          
          // Limit to requested number per source
          result[domain] = sorted.slice(0, limitPerSource);
        }
        
        // Update cache
        articlesCache.byDomain = result;
        
        // Clear this pending fetch
        delete articlesCache.pendingFetches['bySource'];
        
        return result;
      })();
      
      // Store the promise
      articlesCache.pendingFetches['bySource'] = fetchPromise;
      
      return fetchPromise;
    } catch (error) {
      console.error('Error processing articles by source:', error);
      // Clean up pending fetch on error
      delete articlesCache.pendingFetches['bySource'];
      return {};
    }
  };
  
  // Optimized fetch latest articles using cached data
  const fetchLatestArticles = async (limitPerSource = 6) => {
    try {
      console.log('Starting to fetch latest articles...');
      const articlesBySource = await processArticlesBySource(limitPerSource);
      
      // Double-check that each domain has properly sorted articles (newest first)
      const sortedResult = {};
      
      for (const [domain, articles] of Object.entries(articlesBySource)) {
        // Ensure articles are sorted newest first using our universal sorting logic
        const sortedArticles = [...articles].sort((a, b) => {
          const timeA = getTimeValue(a);
          const timeB = getTimeValue(b);
          return timeB - timeA; // newest first
        });
        
        // Limit to requested number per source
        sortedResult[domain] = sortedArticles.slice(0, limitPerSource);
      }
      
      return sortedResult;
    } catch (error) {
      console.error('Error fetching latest articles:', error);
      return {};
    }
  };
  
  // Optimize fetch articles by source to avoid redundant queries
  const fetchArticlesBySource = async (domain) => {
    try {
      console.log(`Starting to fetch articles for source: ${domain}`);
      
      // Try to fetch from cache first
      if (isCacheValid() && articlesCache.byDomain && articlesCache.byDomain[domain]) {
        console.log(`Returning ${domain} articles from cache`);
        return articlesCache.byDomain[domain];
      }
      
      // Check if we have all articles cached - if so, filter from there instead of new query
      if (isCacheValid() && articlesCache.allArticles && articlesCache.allArticles.length > 0) {
        console.log(`Filtering ${domain} articles from cached all articles`);
        
        const filtered = articlesCache.allArticles.filter(article => 
          article.source_domain === domain
        );
        
        // Sort the results using our universal sorting logic to ensure newest first
        filtered.sort((a, b) => {
          const timeA = getTimeValue(a);
          const timeB = getTimeValue(b);
          return timeB - timeA; // newest first
        });
        
        // Store in domain cache
        if (!articlesCache.byDomain) articlesCache.byDomain = {};
        articlesCache.byDomain[domain] = filtered;
        
        return filtered;
      }
      
      // Check if we already have a fetch in progress for this domain
      const fetchKey = `domain_${domain}`;
      if (articlesCache.pendingFetches[fetchKey]) {
        console.log(`Reusing in-progress fetch for domain ${domain}`);
        return articlesCache.pendingFetches[fetchKey];
      }
      
      // Create a new promise and store in pendingFetches
      const fetchPromise = (async () => {
        // If not in cache or cache invalid, query Firestore
        console.log(`Querying Firestore for domain ${domain}`);
        const simpleQuery = query(
          collection(firestore, 'articles'),
          where('source_domain', '==', domain)
        );
        
        const snapshot = await getDocs(simpleQuery);
        console.log(`Got ${snapshot.size} articles for domain ${domain}`);
        
        if (snapshot.empty) {
          return [];
        }
        
        // Process the results 
        const articles = [];
        snapshot.forEach(doc => {
          articles.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        // Sort the results using our universal sorting logic to ensure newest first
        articles.sort((a, b) => {
          const timeA = getTimeValue(a);
          const timeB = getTimeValue(b);
          return timeB - timeA; // newest first
        });
        
        // Update domain in cache
        if (!articlesCache.byDomain) articlesCache.byDomain = {};
        articlesCache.byDomain[domain] = articles;
        
        // Clear this pending fetch
        delete articlesCache.pendingFetches[fetchKey];
        
        return articles;
      })();
      
      // Store the promise
      articlesCache.pendingFetches[fetchKey] = fetchPromise;
      
      return fetchPromise;
    } catch (error) {
      console.error(`Error fetching articles for source ${domain}:`, error);
      // Clean up pending fetch on error
      const fetchKey = `domain_${domain}`;
      delete articlesCache.pendingFetches[fetchKey];
      return [];
    }
  };
  
  // New method to get available domains without additional Firestore query
  const getAvailableDomains = async () => {
    // If we have cached domains, return them
    if (articlesCache.structuredData.domains && articlesCache.structuredData.domains.length > 0) {
      return articlesCache.structuredData.domains;
    }
    
    // Otherwise fetch all articles first, which will populate domains
    await fetchAllArticles();
    return articlesCache.structuredData.domains;
  };
  
  // Debug-only function to expose cache state for monitoring
  // This should only be used by the debug page
  const _getCacheState = () => {
    return { ...articlesCache };
  };
  
  return {
    fetchLatestArticles,
    fetchArticlesBySource,
    verifyArticlesCollection,
    fetchAllArticles,
    getAvailableDomains,
    clearCache,
    _getCacheState // Only for debugging purposes
  };
}; 