export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim())
  if (!m) return null
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) }
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('')}`.toUpperCase()
}

export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rd = r / 255
  const gd = g / 255
  const bd = b / 255
  const max = Math.max(rd, gd, bd)
  const min = Math.min(rd, gd, bd)
  const l = (max + min) / 2

  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  switch (max) {
    case rd: h = ((gd - bd) / d + (gd < bd ? 6 : 0)) / 6; break
    case gd: h = ((bd - rd) / d + 2) / 6; break
    case bd: h = ((rd - gd) / d + 4) / 6; break
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sd = s / 100
  const ld = l / 100
  const c = (1 - Math.abs(2 * ld - 1)) * sd
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = ld - c / 2
  let rd = 0, gd = 0, bd = 0
  if (h < 60) { rd = c; gd = x }
  else if (h < 120) { rd = x; gd = c }
  else if (h < 180) { gd = c; bd = x }
  else if (h < 240) { gd = x; bd = c }
  else if (h < 300) { rd = x; bd = c }
  else { rd = c; bd = x }
  return {
    r: Math.round((rd + m) * 255),
    g: Math.round((gd + m) * 255),
    b: Math.round((bd + m) * 255),
  }
}

export function formatHex(hex: string): string {
  const clean = hex.trim().replace('#', '')
  if (clean.length === 3) {
    return `#${clean.split('').map((c) => c + c).join('')}`.toUpperCase()
  }
  return `#${clean}`.toUpperCase()
}
