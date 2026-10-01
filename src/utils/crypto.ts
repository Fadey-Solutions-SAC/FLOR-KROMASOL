import {
  ADMIN_PASSWORD_HASH,
  ADMIN_PBKDF2_ITERATIONS,
  ADMIN_SALT_PREFIX,
} from '../config/admin'

function toHex(buffer: ArrayBuffer): string {
  return [...new Uint8Array(buffer)]
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export async function deriveCredentialHash(
  username: string,
  password: string,
): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode(`${ADMIN_SALT_PREFIX}${username}`),
      iterations: ADMIN_PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    key,
    256,
  )

  return toHex(bits)
}

export function timingSafeEqual(left: string, right: string): boolean {
  const length = Math.max(left.length, right.length)
  let diff = left.length ^ right.length

  for (let index = 0; index < length; index += 1) {
    diff |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0)
  }

  return diff === 0
}

export async function verifyAdminCredentials(
  username: string,
  password: string,
): Promise<boolean> {
  const hash = await deriveCredentialHash(username, password)
  return timingSafeEqual(hash, ADMIN_PASSWORD_HASH)
}

export async function waitAtLeast(startedAt: number, minimumMs: number) {
  const elapsed = Date.now() - startedAt
  if (elapsed < minimumMs) {
    await new Promise((resolve) => {
      window.setTimeout(resolve, minimumMs - elapsed)
    })
  }
}
