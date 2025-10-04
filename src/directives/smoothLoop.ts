import type { Directive } from 'vue';

export const smoothLoop: Directive = {
  mounted(el: HTMLVideoElement) {
    if (el.tagName !== 'VIDEO') return;

    let animationFrameId: number | null = null;

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
    
    // Запускаем плавное зацикливание
    startLoop();

    // Сохраняем функцию остановки для cleanup
    (el as any).__stopSmoothLoop = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
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
