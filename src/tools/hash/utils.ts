export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-512'

export async function computeHash(
  input: string,
  algorithm: HashAlgorithm,
): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(input)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
