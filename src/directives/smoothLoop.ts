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

    // Убираем стандартный loop атрибут
    el.removeAttribute('loop');

    // Запускаем плавное зацикливание
    function startLoop() {
      if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(checkLoop);
      }
    }

    function stopLoop() {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }

    // Слушаем события воспроизведения для запуска зацикливания
    el.addEventListener('play', startLoop);
    el.addEventListener('pause', stopLoop);

    // Сохраняем функции для cleanup
    (el as any).__stopSmoothLoop = () => {
      stopLoop();
      el.removeEventListener('play', startLoop);
      el.removeEventListener('pause', stopLoop);
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