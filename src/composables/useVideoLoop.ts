import { ref, onMounted, onUnmounted } from 'vue';

export function useVideoLoop() {
  const videoRef = ref<HTMLVideoElement | null>(null);
  let animationFrameId: number | null = null;

  function startSmoothLoop(video: HTMLVideoElement) {
    if (!video) return;

    function checkLoop() {
      if (video.duration && video.currentTime >= video.duration - 0.033) {
        // 0.033 сек ≈ один кадр при 30fps (1/30 = 0.0333)
        video.currentTime = 0.01;
      }
      animationFrameId = requestAnimationFrame(checkLoop);
    }

    // Запускаем проверку после загрузки метаданных
    if (video.readyState >= 1) {
      // Метаданные уже загружены
      requestAnimationFrame(checkLoop);
    } else {
      // Ждем загрузки метаданных
      video.addEventListener('loadedmetadata', () => {
        requestAnimationFrame(checkLoop);
      }, { once: true });
    }
  }

  function stopSmoothLoop() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  onMounted(() => {
    if (videoRef.value) {
      startSmoothLoop(videoRef.value);
    }
  });

  onUnmounted(() => {
    stopSmoothLoop();
  });

  return {
    videoRef,
    startSmoothLoop,
    stopSmoothLoop
  };
}
