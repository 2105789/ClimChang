// Intersection Observer Plugin
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('intersection', {
    mounted(el, binding) {
      // Skip if no binding value (allows conditionally using the directive)
      if (!binding.value) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (typeof binding.value === 'function') {
              binding.value(el, entry);
            } else if (binding.value.handler) {
              binding.value.handler(el, entry);
            }
          }
        });
      }, binding.value.options || {});
      
      observer.observe(el);
      el._observer = observer;
    },
    
    unmounted(el) {
      if (el._observer) {
        el._observer.disconnect();
      }
    },
    
    // Support for v-if/v-else conditions
    updated(el, binding) {
      if (el._observer) {
        el._observer.disconnect();
      }
      
      if (!binding.value) return;
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (typeof binding.value === 'function') {
              binding.value(el, entry);
            } else if (binding.value.handler) {
              binding.value.handler(el, entry);
            }
          }
        });
      }, binding.value.options || {});
      
      observer.observe(el);
      el._observer = observer;
    }
  });
}); 