export interface PasswordOptions {
  length: number
  uppercase: boolean
  lowercase: boolean
  numbers: boolean
  symbols: boolean
}

const CHARSETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
}

export function generatePassword(opts: PasswordOptions): string {
  if (opts.length <= 0) return ''
  const pools: string[] = []
  if (opts.uppercase) pools.push(CHARSETS.uppercase)
  if (opts.lowercase) pools.push(CHARSETS.lowercase)
  if (opts.numbers) pools.push(CHARSETS.numbers)
  if (opts.symbols) pools.push(CHARSETS.symbols)

  if (pools.length === 0) return ''

  const allChars = pools.join('')
  const maxExclusive = 0x100000000
  const maxMod = maxExclusive - (maxExclusive % allChars.length)
  let randomIndex: number
  const randomValues = new Uint32Array(1)

  const nextIndex = () => {
    do {
      crypto.getRandomValues(randomValues)
      randomIndex = Number(randomValues[0])
    } while (randomIndex >= maxMod)
    return randomIndex % allChars.length
  }

  return Array.from({ length: opts.length }, nextIndex)
    .map((index) => allChars[index])
    .join('')
}

export function getPasswordStrength(password: string): {
  level: 'weak' | 'medium' | 'strong'
  label: string
} {
  if (!password) return { level: 'weak', label: '无' }

  let score = 0
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (password.length >= 16) score++
  if (/[a-z]/.test(password)) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 3) return { level: 'weak', label: '弱' }
  if (score <= 5) return { level: 'medium', label: '中' }
  return { level: 'strong', label: '强' }
}
