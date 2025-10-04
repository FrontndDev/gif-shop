import { ref, onMounted, onUnmounted } from 'vue'

const activeVideos = new Map<HTMLVideoElement, boolean>()
const maxVideos = 6
const observedVideos = new Map<HTMLVideoElement, { priority: number; visible: boolean }>()

let rafId: number | null = null

function updateActiveVideos() {
  // Сортируем по приоритету (меньше = важнее)
  const sorted = [...observedVideos.entries()]
    .filter(([_, meta]) => meta.visible)
    .sort((a, b) => a[1].priority - b[1].priority)

  const toPlay = sorted.slice(0, maxVideos)
  const toPause = [...activeVideos.keys()].filter(
    el => !toPlay.some(([v]) => v === el)
  )

  // Останавливаем видео, которые не должны играть
  toPause.forEach(el => {
    el.pause()
    activeVideos.delete(el)
  })

  // Запускаем видео, которые должны играть
  toPlay.forEach(([el]) => {
    if (!activeVideos.has(el)) {
      el.play().catch(() => {
        // Игнорируем ошибки воспроизведения
      })
      activeVideos.set(el, true)
    }
  })

  rafId = requestAnimationFrame(updateActiveVideos)
}

export function useVideoManager() {
  onMounted(() => {
    if (!rafId) {
      updateActiveVideos()
    }
  })

  onUnmounted(() => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  })

  return {
    register(videoEl: HTMLVideoElement, getPriority: () => number, getVisible: () => boolean) {
      const meta = { priority: 0, visible: false }
      observedVideos.set(videoEl, meta)

      const updateMeta = () => {
        meta.priority = getPriority()
        meta.visible = getVisible()
      }

      const interval = setInterval(updateMeta, 200)
      
      return () => {
        clearInterval(interval)
        observedVideos.delete(videoEl)
        activeVideos.delete(videoEl)
        videoEl.pause()
      }
    }
  }
}
