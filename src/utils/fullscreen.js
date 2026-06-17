export const requestMobileFullscreen = () => {
  // Only attempt on mobile screens
  if (window.innerWidth <= 768) {
    const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) { /* Safari */
        elem.webkitRequestFullscreen().catch(() => {});
      } else if (elem.msRequestFullscreen) { /* IE11 */
        elem.msRequestFullscreen().catch(() => {});
      }
    } catch (e) {
      console.warn("Fullscreen request failed", e);
    }
  }
};
