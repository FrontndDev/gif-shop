import type { Directive } from 'vue';

export const smoothLoop: Directive = {
  mounted(el: HTMLVideoElement) {
    if (el.tagName !== 'VIDEO') return;

    let animationFrameId: number | null = null;
    let isPlaying = false;

    function checkLoop() {
      if (!isPlaying || !el.duration) {
        animationFrameId = requestAnimationFrame(checkLoop);
        return;
      }

      // Проверяем, близко ли видео к концу (за 2 кадра до конца при 30fps)
      if (el.currentTime >= el.duration - 0.066) {
        el.currentTime = 0.01; // Перезапускаем с небольшого отступа
      }
      
      animationFrameId = requestAnimationFrame(checkLoop);
    }

    // Проверяем, есть ли атрибут loop
    const hasLoop = el.hasAttribute('loop');
    
    // Если есть loop атрибут, используем его, иначе используем плавное зацикливание
    if (hasLoop) {
      // Оставляем стандартный loop атрибут
      return;
    }
    
    // Запускаем плавное зацикливание
    function startLoop() {
      if (!animationFrameId) {
        isPlaying = true;
        animationFrameId = requestAnimationFrame(checkLoop);
      }
    }

    function stopLoop() {
      isPlaying = false;
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }

    // Слушаем события воспроизведения для запуска зацикливания
    el.addEventListener('play', startLoop);
    el.addEventListener('pause', stopLoop);
    el.addEventListener('ended', () => {
      el.currentTime = 0.01;
      el.play().catch(() => {});
    });
    
    // Принудительно запускаем зацикливание если видео уже воспроизводится
    if (!el.paused) {
      startLoop();
    }

    // Сохраняем функции для cleanup
    (el as any).__stopSmoothLoop = () => {
      stopLoop();
      el.removeEventListener('play', startLoop);
      el.removeEventListener('pause', stopLoop);
      el.removeEventListener('ended', () => {});
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