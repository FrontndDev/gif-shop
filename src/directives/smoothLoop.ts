import type { Directive } from 'vue';

export const smoothLoop: Directive = {
  mounted(el: HTMLVideoElement) {
    if (el.tagName !== 'VIDEO') return;

    let animationFrameId: number | null = null;
    let intersectionObserver: IntersectionObserver | null = null;

    function checkLoop() {
      if (el.duration && el.currentTime >= el.duration - 0.033) {
        // 0.033 сек ≈ один кадр при 30fps (1/30 = 0.0333)
        el.currentTime = 0.01;
      }
      animationFrameId = requestAnimationFrame(checkLoop);
    }

    async function playVideo() {
      if (!el) return;
      
      try {
        await el.play();
        if (!animationFrameId) {
          animationFrameId = requestAnimationFrame(checkLoop);
        }
      } catch (e) {
        console.warn('Не удалось воспроизвести видео:', e);
      }
    }

    function pauseVideo() {
      if (el) {
        el.pause();
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          playVideo();
        } else {
          pauseVideo();
        }
      });
    };

    // Убираем стандартный loop атрибут
    el.removeAttribute('loop');
    
    // Настраиваем Intersection Observer
    intersectionObserver = new IntersectionObserver(handleIntersection, {
      threshold: 0.1, // Срабатывает когда 10% видео видно
      rootMargin: '50px' // +50px вокруг viewport
    });
    
    intersectionObserver.observe(el);

    // Сохраняем функции для cleanup
    (el as any).__stopSmoothLoop = () => {
      pauseVideo();
      if (intersectionObserver) {
        intersectionObserver.disconnect();
      }
    };
  },

  unmounted(el: HTMLVideoElement) {
    if (el.tagName !== 'VIDEO') return;
    
    // Останавливаем анимацию при размонтировании
    if ((el as any).__stopSmoothLoop) {
      (el as any).__stopSmoothLoop();
    }
  }
};
