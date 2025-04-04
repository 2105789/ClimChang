<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <NewsletterPopup />
</template>

<script setup>
import NewsletterPopup from '~/components/NewsletterPopup.vue';

// Set page metadata
useHead({
  title: 'Climate Change Insights - Climate Science & Solutions',
  meta: [
    { name: 'description', content: 'Exploring climate change science, impacts, and solutions for our planet\'s most pressing challenge.' }
  ],
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ]
})
</script>
