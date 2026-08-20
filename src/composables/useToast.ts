import { reactive } from 'vue'

export type ToastType = 'success' | 'error' | 'warning'

export interface ToastItem {
  id: number
  type: ToastType
  message: string
  duration: number
}

const state = reactive<{
  toasts: ToastItem[]
}>({
  toasts: [],
})

let idCounter = 0
const timers = new Map<number, ReturnType<typeof setTimeout>>()

function clearToastTimer(id: number) {
  const timer = timers.get(id)
  if (!timer) return
  clearTimeout(timer)
  timers.delete(id)
}

function addToast(message: string, type: ToastType, duration = 3000) {
  const id = ++idCounter
  const toast: ToastItem = { id, type, message, duration }
  state.toasts.push(toast)

  if (duration > 0) {
    const timer = setTimeout(() => {
      removeToast(id)
    }, duration)
    timers.set(id, timer)
  }
}

export function removeToast(id: number) {
  clearToastTimer(id)
  const index = state.toasts.findIndex((t) => t.id === id)
  if (index > -1) {
    state.toasts.splice(index, 1)
  }
}

export function useToast() {
  return {
    toasts: state.toasts,
    success: (message: string, duration?: number) =>
      addToast(message, 'success', duration),
    error: (message: string, duration?: number) =>
      addToast(message, 'error', duration),
    warning: (message: string, duration?: number) =>
      addToast(message, 'warning', duration),
    remove: removeToast,
  }
}
