export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const { initColorMode } = useColorMode();
    initColorMode();
  });
}); 