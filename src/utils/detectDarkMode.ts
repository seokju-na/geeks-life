export function detectDarkMode() {
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  return {
    isDarkMode: media.matches,
    listen: (callback: (isDarkMode: boolean) => void) => {
      const listener = (e: MediaQueryListEvent) => {
        callback(e.matches);
      };
      media.addEventListener('change', listener);

      return () => {
        media.removeEventListener('change', listener);
      };
    },
  };
}
