<template>
  <article
    class="bg-card border border-primary-100/80 dark:border-primary-800/50 overflow-hidden shadow-sm rounded-md h-full flex flex-col animate-pulse"
  >
    <!-- Image placeholder -->
    <div class="block flex-shrink-0">
      <div class="relative aspect-video overflow-hidden bg-primary-100 dark:bg-primary-800/30"></div>
    </div>

    <div class="p-5 flex-1 flex flex-col">
      <div class="flex justify-between items-center mb-2">
        <!-- Domain badge placeholder -->
        <div class="w-24 h-5 bg-primary-100 dark:bg-primary-800/50 rounded-sm"></div>
        <!-- Date placeholder -->
        <div class="w-16 h-4 bg-primary-100 dark:bg-primary-800/50 rounded-sm ml-auto"></div>
      </div>

      <!-- Title placeholder -->
      <div class="h-6 bg-primary-100 dark:bg-primary-800/50 rounded-sm mb-2"></div>
      <div class="h-6 bg-primary-100 dark:bg-primary-800/50 rounded-sm w-3/4 mb-2"></div>

      <div class="mt-auto pt-4">
        <div class="flex items-center justify-between">
          <!-- Read article link placeholder -->
          <div class="w-24 h-5 bg-primary-100 dark:bg-primary-800/50 rounded-sm"></div>
          <!-- Source link placeholder -->
          <div class="w-20 h-4 bg-primary-100 dark:bg-primary-800/50 rounded-sm"></div>
        </div>
      </div>
    </div>
  </article>
</template>

<script setup>
// No props or logic needed for the skeleton component
</script> 