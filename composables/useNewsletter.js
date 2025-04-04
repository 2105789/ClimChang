import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { ref, computed } from 'vue';

export const useNewsletter = () => {
  const { $firebase } = useNuxtApp();
  const firestore = $firebase.firestore;
  
  const isSubscribing = ref(false);
  const subscriptionError = ref(null);
  const subscriptionSuccess = ref(false);
  
  // Check if user is already subscribed based on localStorage
  const isAlreadySubscribed = computed(() => {
    if (process.client) {
      return localStorage.getItem('newsletter_subscribed') === 'true';
    }
    return false;
  });
  
  /**
   * Subscribe a user to the newsletter
   * @param {string} email - User's email address
   * @returns {Promise<boolean>} - Success status
   */
  const subscribeToNewsletter = async (email) => {
    if (!email || !validateEmail(email)) {
      subscriptionError.value = 'Please enter a valid email address';
      return false;
    }
    
    try {
      isSubscribing.value = true;
      subscriptionError.value = null;
      
      // Check if this email is already in the database
      const emailsCollection = collection(firestore, 'newsletter_subscribers');
      const q = query(emailsCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        // Email already exists in database
        subscriptionError.value = 'This email is already subscribed to our newsletter';
        isSubscribing.value = false;
        return false;
      }
      
      // Add the email to Firestore
      await addDoc(collection(firestore, 'newsletter_subscribers'), {
        email,
        subscribedAt: new Date(),
      });
      
      // Save to localStorage to remember this user has subscribed
      if (process.client) {
        localStorage.setItem('newsletter_subscribed', 'true');
      }
      
      subscriptionSuccess.value = true;
      return true;
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      subscriptionError.value = 'An error occurred while subscribing. Please try again later.';
      return false;
    } finally {
      isSubscribing.value = false;
    }
  };
  
  /**
   * Simple email validation
   * @param {string} email - Email to validate
   * @returns {boolean} - Validation result
   */
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  return {
    isSubscribing,
    subscriptionError,
    subscriptionSuccess,
    isAlreadySubscribed,
    subscribeToNewsletter,
  };
}; 