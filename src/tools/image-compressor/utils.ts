export interface CompressOptions {
  maxWidth: number
  maxHeight: number
  quality: number
  type: 'image/jpeg' | 'image/png' | 'image/webp'
}

export interface CompressResult {
  dataUrl: string
  blob: Blob
  originalSize: number
  compressedSize: number
}

export function readImageFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export async function compressImage(
  file: File,
  options: CompressOptions,
): Promise<CompressResult> {
  const img = await readImageFile(file)

  let { width, height } = img
  const ratio = Math.min(options.maxWidth / width, options.maxHeight / height, 1)
  width = Math.round(width * ratio)
  height = Math.round(height * ratio)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('无法创建 canvas 上下文')
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b)
        else reject(new Error('图片压缩失败'))
      },
      options.type,
      options.quality,
    )
  })

  const dataUrl = URL.createObjectURL(blob)

  return {
    dataUrl,
    blob,
    originalSize: file.size,
    compressedSize: blob.size,
  }
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / 1024 ** i).toFixed(2)} ${units[i]}`
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
