import { collection, getDocs, getDoc, doc, query, where, orderBy, limit } from 'firebase/firestore';

export const useFirestore = () => {
  const { $firebase } = useNuxtApp();
  const firestore = $firebase.firestore;

  const getPosts = async () => {
    try {
      const postsCollection = collection(firestore, 'posts');
      const postsQuery = query(postsCollection, orderBy('publishedAt', 'desc'));
      const querySnapshot = await getDocs(postsQuery);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  };

  const getPost = async (postId) => {
    try {
      const postDoc = doc(firestore, 'posts', postId);
      const postSnapshot = await getDoc(postDoc);
      
      if (postSnapshot.exists()) {
        return {
          id: postSnapshot.id,
          ...postSnapshot.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting post:', error);
      return null;
    }
  };

  const getPostBySlug = async (slug) => {
    try {
      const postsCollection = collection(firestore, 'posts');
      const postsQuery = query(postsCollection, where('slug', '==', slug));
      const querySnapshot = await getDocs(postsQuery);
      
      if (!querySnapshot.empty) {
        const postDoc = querySnapshot.docs[0];
        return {
          id: postDoc.id,
          ...postDoc.data()
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error getting post by slug:', error);
      return null;
    }
  };

  const getPostsByCategory = async (categoryId) => {
    try {
      console.log(`Querying posts for category ID: ${categoryId}`);
      
      // First, try to query with an exact match
      const postsCollection = collection(firestore, 'posts');
      const postsQuery = query(
        postsCollection, 
        where('categoryId', '==', categoryId),
        orderBy('publishedAt', 'desc')
      );
      const querySnapshot = await getDocs(postsQuery);
      
      const results = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      console.log(`Firebase query returned ${results.length} posts for category ${categoryId}`);
      
      // If no results and we have a valid categoryId, fetch all posts and filter manually
      if (results.length === 0 && categoryId) {
        console.log('No posts found in Firebase query, trying manual filtering as fallback');
        
        // Get all posts
        const allPostsQuery = query(postsCollection, orderBy('publishedAt', 'desc'));
        const allPostsSnapshot = await getDocs(allPostsQuery);
        
        // Convert to array
        const allPosts = allPostsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        // Filter posts for the category, including some flexibility in matching
        const filteredPosts = allPosts.filter(post => {
          // Check for different potential matches
          if (post.categoryId === categoryId) return true;  // Exact match
          if (post.categoryId && post.categoryId.trim() === categoryId.trim()) return true; // Whitespace issues
          return false;
        });
        
        console.log(`Manual filtering found ${filteredPosts.length} posts for category ${categoryId}`);
        
        // If we found posts with manual filtering, return those
        if (filteredPosts.length > 0) {
          return filteredPosts;
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error getting posts by category:', error);
      return [];
    }
  };

  const getCategories = async () => {
    try {
      const categoriesCollection = collection(firestore, 'categories');
      const querySnapshot = await getDocs(categoriesCollection);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting categories:', error);
      return [];
    }
  };

  const getRelatedPosts = async (categoryId, currentPostId, count = 3) => {
    try {
      console.log(`Getting related posts for category: ${categoryId}, excluding post: ${currentPostId}`);
      
      if (!categoryId || !currentPostId) {
        console.log('Missing categoryId or currentPostId, cannot fetch related posts');
        return [];
      }
      
      // Get all posts first since the where clause with != may cause issues
      const postsCollection = collection(firestore, 'posts');
      const postsQuery = query(
        postsCollection, 
        orderBy('publishedAt', 'desc')
      );
      const querySnapshot = await getDocs(postsQuery);
      
      // Filter posts manually to get exact matches
      const allPosts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Filter for posts with matching category and different ID
      const filteredPosts = allPosts.filter(post => {
        // Skip the current post
        if (post.id === currentPostId) return false;
        
        // Match posts in the same category
        return post.categoryId === categoryId;
      });
      
      console.log(`Found ${filteredPosts.length} related posts with manual filtering`);
      
      // Return limited number of results
      return filteredPosts.slice(0, count);
    } catch (error) {
      console.error('Error getting related posts:', error);
      return [];
    }
  };

  return {
    getPosts,
    getPost,
    getPostBySlug,
    getPostsByCategory,
    getCategories,
    getRelatedPosts
  };
}; 