<template>
  <div>
    <div v-if="loading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
    </div>
    
    <div v-else-if="post" class="m-4">
      <div class="max-w-3xl mx-auto mb-8">
        <div class="flex items-center gap-3 mb-4">
          <NuxtLink 
            :to="`/category/${categorySlug}`" 
            class="inline-flex items-center rounded-full bg-primary-50 dark:bg-primary-900 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300"
          >
            {{ categoryName }}
          </NuxtLink>
          <span class="text-sm text-muted-foreground">
            {{ formatDate(post.publishedAt) }}
          </span>
        </div>
        
        <h1 class="text-4xl font-bold mb-6">{{ post.title }}</h1>
        
        <div class="hidden flex items-center gap-4 mb-8">
          <div class="w-10 h-10 rounded-full overflow-hidden">
            <img 
              :src="post.author.avatarUrl" 
              :alt="post.author.name" 
              class="object-cover w-full h-full"
            />
          </div>
          <div>
            <div class="font-medium">{{ post.author.name }}</div>
            <div class="text-sm text-muted-foreground">{{ post.author.title }}</div>
          </div>
        </div>
      </div>
      
      <div class="mb-10 max-w-5xl mx-auto">
        <div class="w-full aspect-video rounded-lg overflow-hidden mb-8">
          <img 
            :src="post.imageUrl" 
            :alt="post.title" 
            class="object-cover w-full h-full"
          />
        </div>
        
        <div class="max-w-3xl mx-auto prose dark:prose-invert">
          <div v-html="renderedContent"></div>
        </div>
      </div>
      
      <div class="max-w-5xl mx-auto">
        <RelatedPosts :relatedPosts="relatedPosts" :loading="loadingRelated" />
      </div>
    </div>
    <div v-else class="p-12 text-center rounded-md border border-border">
      <p class="text-muted-foreground">Post not found.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { marked } from 'marked';

const route = useRoute();
const { slug } = route.params;

const post = ref(null);
const categories = ref([]);
const relatedPosts = ref([]);
const loading = ref(true);
const loadingRelated = ref(true);
const { getPost, getCategories, getRelatedPosts, getPostBySlug } = useFirestore();

const categoryName = computed(() => {
  if (!post.value || !categories.value.length) return '';
  
  const category = categories.value.find(cat => cat.id === post.value.categoryId);
  return category ? category.name : '';
});

const categorySlug = computed(() => {
  if (!post.value || !categories.value.length) return '';
  
  const category = categories.value.find(cat => cat.id === post.value.categoryId);
  return category ? category.slug : '';
});

const renderedContent = computed(() => {
  if (!post.value || !post.value.content) return '';
  return marked(post.value.content);
});

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = new Date(timestamp.seconds * 1000);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

onMounted(async () => {
  try {
    loading.value = true;
    
    // Get all categories
    categories.value = await getCategories();
    
    // Get post by slug
    const postData = await getPostBySlug(slug);
    if (postData) {
      post.value = postData;
      
      // Load related posts
      loadingRelated.value = true;
      relatedPosts.value = await getRelatedPosts(post.value.categoryId, post.value.id);
      loadingRelated.value = false;
    }
  } catch (error) {
    console.error('Error fetching post data:', error);
  } finally {
    loading.value = false;
  }
});
</script> 