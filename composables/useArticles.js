import { collection, query, orderBy, limit, where, getDocs, getFirestore, Timestamp } from 'firebase/firestore';

export const useArticles = () => {
  const { $firebase } = useNuxtApp();
  const firestore = $firebase.firestore;
  
  // Cache for articles to improve performance
  const articlesCache = {
    allArticles: null,
    byDomain: {},
    lastFetch: null,
    cacheDuration: 5 * 60 * 1000 // 5 minutes cache duration
  };
  
  // Function to clear cache
  const clearCache = () => {
    articlesCache.allArticles = null;
    articlesCache.byDomain = {};
    articlesCache.lastFetch = null;
  };
  
  // Check if cache is valid
  const isCacheValid = () => {
    if (!articlesCache.lastFetch) return false;
    
    const now = new Date().getTime();
    return (now - articlesCache.lastFetch) < articlesCache.cacheDuration;
  };
  
  // Helper function to log a document's structure
  const logDocStructure = (doc) => {
    const data = doc.data();
    console.log('Document ID:', doc.id);
    console.log('Fields:', Object.keys(data));
    console.log('Sample data:', data);
  };
  
  // Check if the articles collection exists and has documents
  const verifyArticlesCollection = async () => {
    try {
      console.log('Verifying articles collection...');
      const articlesQuery = query(
        collection(firestore, 'articles'),
        limit(5)
      );
      
      const snapshot = await getDocs(articlesQuery);
      console.log(`Articles collection has ${snapshot.size} documents`);
      
      if (!snapshot.empty) {
        console.log('Sample documents:');
        snapshot.forEach(doc => {
          logDocStructure(doc);
        });
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

  // Optimized fetch all articles function with caching
  const fetchAllArticles = async () => {
    try {
      // Return from cache if valid
      if (isCacheValid() && articlesCache.allArticles) {
        console.log('Returning articles from cache');
        return articlesCache.allArticles;
      }
      
      console.log('Fetching all articles without complex ordering');
      const articlesQuery = query(
        collection(firestore, 'articles')
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
      
      return articles;
    } catch (error) {
      console.error('Error fetching all articles:', error);
      return [];
    }
  };
  
  // Helper function to get timestamp from different date formats
  const getTimeValue = (article) => {
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
  
  // Optimized function to process articles by source (uses cache)
  const processArticlesBySource = async (limitPerSource = 6) => {
    try {
      // Check if we have the domain already cached
      if (isCacheValid() && Object.keys(articlesCache.byDomain).length > 0) {
        console.log('Returning articles by source from cache');
        return articlesCache.byDomain;
      }
      
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
        
        // Universal sorting logic using our helper function
        sorted.sort((a, b) => {
          return getTimeValue(b) - getTimeValue(a);
        });
        
        // Limit to requested number per source
        result[domain] = sorted.slice(0, limitPerSource);
      }
      
      // Update cache
      articlesCache.byDomain = result;
      
      return result;
    } catch (error) {
      console.error('Error processing articles by source:', error);
      return {};
    }
  };
  
  // Optimized fetch latest articles that always uses the client-side approach now
  // This solves the complex index issues and is more efficient
  const fetchLatestArticles = async (limitPerSource = 6) => {
    try {
      console.log('Starting to fetch latest articles...');
      
      // Always use the simplified approach now
      return await processArticlesBySource(limitPerSource);
    } catch (error) {
      console.error('Error fetching latest articles:', error);
      return {};
    }
  };
  
  // Optimize the fetch articles by source function to use cache
  const fetchArticlesBySource = async (domain) => {
    try {
      console.log(`Starting to fetch articles for source: ${domain}`);
      
      // Try to fetch from cache first
      if (isCacheValid() && articlesCache.byDomain && articlesCache.byDomain[domain]) {
        console.log(`Returning ${domain} articles from cache`);
        return articlesCache.byDomain[domain];
      }
      
      // If not in cache or cache invalid, try the simple approach
      console.log('Trying simple approach (no ordering)');
      const simpleQuery = query(
        collection(firestore, 'articles'),
        where('source_domain', '==', domain)
      );
      
      const snapshot = await getDocs(simpleQuery);
      console.log(`Got ${snapshot.size} articles for domain ${domain}`);
      
      if (snapshot.empty) {
        return [];
      }
      
      // Process the results manually
      const articles = [];
      snapshot.forEach(doc => {
        articles.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Sort the results using our universal sorting logic
      articles.sort((a, b) => {
        return getTimeValue(b) - getTimeValue(a);
      });
      
      // If we don't have the domain in the cache, add it
      if (!articlesCache.byDomain[domain]) {
        articlesCache.byDomain[domain] = articles;
      }
      
      return articles;
    } catch (error) {
      console.error(`Error fetching articles for source ${domain}:`, error);
      return [];
    }
  };
  
  return {
    fetchLatestArticles,
    fetchArticlesBySource,
    verifyArticlesCollection,
    fetchAllArticles,
    clearCache
  };
}; 