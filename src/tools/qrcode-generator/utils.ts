import QRCode from 'qrcode'

export async function generateQRCode(
  text: string,
  options?: { width?: number; margin?: number },
): Promise<string> {
  if (!text.trim()) return ''
  return QRCode.toDataURL(text, {
    width: options?.width || 256,
    margin: options?.margin || 2,
    color: { dark: '#000000', light: '#ffffff' },
  })
}
