import type { Component } from 'vue'

export interface Tool {
  id: string
  name: string
  path: string
  description: string
  category: string
  keywords: string[]
  component: () => Promise<Component>
  icon: Component
  redirectFrom?: string[]
}
