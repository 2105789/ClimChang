export default defineNuxtPlugin((nuxtApp) => {
  // Only use mock data in development mode if explicitly requested
  const useMockData = process.env.NODE_ENV === 'development' && process.env.USE_MOCK_DATA === 'true';
  
  if (useMockData) {
    // Override the useFirestore composable with our mock data
    nuxtApp.hook('app:created', () => {
      const { categories, authors, posts, getPost, getPostsByCategory, getRelatedPosts } = useMockData();
      
      // Override the Firestore methods with our mock data functions
      nuxtApp.provide('useFirestore', () => {
        return {
          getCategories: async () => categories,
          getPosts: async () => posts,
          getPost: async (slug) => getPost(slug),
          getPostsByCategory: async (categoryId) => getPostsByCategory(categoryId),
          getRelatedPosts: async (categoryId, currentPostId, count) => getRelatedPosts(categoryId, currentPostId, count)
        };
      });
    });
  }
}); 