import { ref, onMounted, onUnmounted } from 'vue';

export function useVideoVisibility() {
  const videoRefs = ref<Map<string, HTMLVideoElement>>(new Map());
  const observer = ref<IntersectionObserver | null>(null);
  const visibleVideos = ref<Set<string>>(new Set());
  const maxConcurrentVideos = 3; // Максимальное количество одновременно воспроизводимых видео

  function handleIntersection(entries: IntersectionObserverEntry[]) {
    entries.forEach(entry => {
      const videoId = entry.target.getAttribute('data-video-id');
      if (!videoId) return;

      const video = videoRefs.value.get(videoId);
      if (!video) return;

      if (entry.isIntersecting) {
        // Видео стало видимым
        visibleVideos.value.add(videoId);
        
        // Если достигли лимита, приостанавливаем самое дальнее видео
        if (visibleVideos.value.size > maxConcurrentVideos) {
          pauseFurthestVideo();
        }
        
        // Запускаем текущее видео
        playVideo(video);
      } else {
        // Видео стало невидимым
        visibleVideos.value.delete(videoId);
        pauseVideo(video);
      }
    });
  }

  function pauseFurthestVideo() {
    // Находим видео, которое находится дальше всего от центра экрана
    let furthestVideo: HTMLVideoElement | null = null;
    let maxDistance = 0;

    visibleVideos.value.forEach(videoId => {
      const video = videoRefs.value.get(videoId);
      if (!video) return;

      const rect = video.getBoundingClientRect();
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const videoCenterX = rect.left + rect.width / 2;
      const videoCenterY = rect.top + rect.height / 2;
      
      const distance = Math.sqrt(
        Math.pow(videoCenterX - centerX, 2) + Math.pow(videoCenterY - centerY, 2)
      );

      if (distance > maxDistance) {
        maxDistance = distance;
        furthestVideo = video;
      }
    });

    if (furthestVideo) {
      pauseVideo(furthestVideo);
      // Удаляем из видимых
      const videoId = furthestVideo.getAttribute('data-video-id');
      if (videoId) {
        visibleVideos.value.delete(videoId);
      }
    }
  }

  function playVideo(video: HTMLVideoElement) {
    if (video.paused) {
      video.play().catch(error => {
        console.warn('Не удалось воспроизвести видео:', error);
      });
    }
  }

  function pauseVideo(video: HTMLVideoElement) {
    if (!video.paused) {
      video.pause();
    }
  }

  function registerVideo(videoId: string, video: HTMLVideoElement) {
    videoRefs.value.set(videoId, video);
    video.setAttribute('data-video-id', videoId);
    
    if (observer.value) {
      observer.value.observe(video);
    }
  }

  function unregisterVideo(videoId: string) {
    const video = videoRefs.value.get(videoId);
    if (video && observer.value) {
      observer.value.unobserve(video);
    }
    videoRefs.value.delete(videoId);
    visibleVideos.value.delete(videoId);
  }

  onMounted(() => {
    observer.value = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: '50px', // Начинаем воспроизведение за 50px до появления в видимости
      threshold: 0.1
    });
  });

  onUnmounted(() => {
    if (observer.value) {
      observer.value.disconnect();
    }
    videoRefs.value.clear();
    visibleVideos.value.clear();
  });

  return {
    registerVideo,
    unregisterVideo,
    visibleVideos: visibleVideos.value
  };
}
