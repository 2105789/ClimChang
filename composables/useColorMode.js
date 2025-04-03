export const useColorMode = () => {
  const colorMode = useState('color-mode', () => 'light');
  
  const toggleColorMode = () => {
    colorMode.value = colorMode.value === 'light' ? 'dark' : 'light';
    updateHTMLClass();
    localStorage.setItem('color-mode', colorMode.value);
  };
  
  const updateHTMLClass = () => {
    if (process.client) {
      if (colorMode.value === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };
  
  const initColorMode = () => {
    if (process.client) {
      const savedMode = localStorage.getItem('color-mode');
      if (savedMode) {
        colorMode.value = savedMode;
      } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        colorMode.value = 'dark';
      }
      updateHTMLClass();
    }
  };
  
  return {
    colorMode,
    toggleColorMode,
    initColorMode
  };
}; 