<template>
  <div class="min-h-screen flex flex-col bg-background">
    <Header />
    <main class="flex-1 py-8">
      <slot />
    </main>
    <div class="jp-divider"></div>
    <Footer />
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue';
import Footer from '~/components/Footer.vue';
</script> 