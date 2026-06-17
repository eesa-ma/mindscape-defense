export const requestFullscreen = () => {
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
};

export const isFullscreen = () => {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
};

export const toggleFullscreen = () => {
  const elem = document.documentElement;
  if (!isFullscreen()) {
    try {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {});
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen().catch(() => {});
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen().catch(() => {});
      }
    } catch (e) {
      console.warn("Fullscreen request failed", e);
    }
  } else {
    try {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen().catch(() => {});
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen().catch(() => {});
      }
    } catch (e) {
      console.warn("Fullscreen exit failed", e);
    }
  }
};
