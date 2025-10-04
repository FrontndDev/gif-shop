import type { Directive } from 'vue';

export const smoothLoop: Directive = {
  mounted(el: HTMLVideoElement) {
    if (el.tagName !== 'VIDEO') return;

    let animationFrameId: number | null = null;
    const videoId = `video-${Math.random().toString(36).substr(2, 9)}`;

    function checkLoop() {
      if (el.duration && el.currentTime >= el.duration - 0.033) {
        // 0.033 сек ≈ один кадр при 30fps (1/30 = 0.0333)
        el.currentTime = 0.01;
      }
      animationFrameId = requestAnimationFrame(checkLoop);
    }

    function startLoop() {
      if (el.readyState >= 1) {
        // Метаданные уже загружены
        requestAnimationFrame(checkLoop);
      } else {
        // Ждем загрузки метаданных
        el.addEventListener('loadedmetadata', () => {
          requestAnimationFrame(checkLoop);
        }, { once: true });
      }
    }

    // Убираем стандартный loop атрибут
    el.removeAttribute('loop');
    
    // Устанавливаем уникальный ID для видео
    el.setAttribute('data-video-id', videoId);
    
    // Запускаем плавное зацикливание только если видео видимо
    function handleVisibilityChange() {
      if (el.readyState >= 1) {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !animationFrameId) {
          startLoop();
        } else if (!isVisible && animationFrameId) {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      }
    }

    // Проверяем видимость при загрузке
    el.addEventListener('loadedmetadata', () => {
      handleVisibilityChange();
    }, { once: true });

    // Слушаем изменения видимости
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animationFrameId) {
          startLoop();
        } else if (!entry.isIntersecting && animationFrameId) {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      });
    }, {
      rootMargin: '50px'
    });

    intersectionObserver.observe(el);

    // Сохраняем функции для cleanup
    (el as any).__stopSmoothLoop = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
      intersectionObserver.disconnect();
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
