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

function addToast(message: string, type: ToastType, duration = 3000) {
  const id = ++idCounter
  const toast: ToastItem = { id, type, message, duration }
  state.toasts.push(toast)

  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }
}

export function removeToast(id: number) {
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
