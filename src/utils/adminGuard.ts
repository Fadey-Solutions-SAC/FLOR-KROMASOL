import {
  ADMIN_LOCK_KEY,
  ADMIN_LOCKOUT_MS,
  ADMIN_MAX_ATTEMPTS,
  ADMIN_SESSION_KEY,
  ADMIN_SESSION_MS,
} from '../config/admin'

type LockState = {
  fails: number
  lockedUntil: number
}

type SessionState = {
  exp: number
}

function readLock(): LockState {
  try {
    const raw = localStorage.getItem(ADMIN_LOCK_KEY)
    if (!raw) {
      return { fails: 0, lockedUntil: 0 }
    }
    const parsed = JSON.parse(raw) as Partial<LockState>
    return {
      fails: typeof parsed.fails === 'number' ? parsed.fails : 0,
      lockedUntil: typeof parsed.lockedUntil === 'number' ? parsed.lockedUntil : 0,
    }
  } catch {
    return { fails: 0, lockedUntil: 0 }
  }
}

function writeLock(state: LockState) {
  localStorage.setItem(ADMIN_LOCK_KEY, JSON.stringify(state))
}

export function getAdminLockRemaining(): number {
  const lock = readLock()
  return Math.max(0, lock.lockedUntil - Date.now())
}

export function isAdminLocked(): boolean {
  return getAdminLockRemaining() > 0
}

export function registerAdminFailure(): number {
  const current = readLock()
  const fails = current.fails + 1
  const lockedUntil = fails >= ADMIN_MAX_ATTEMPTS ? Date.now() + ADMIN_LOCKOUT_MS : 0
  writeLock({ fails, lockedUntil })
  return getAdminLockRemaining()
}

export function clearAdminLock() {
  localStorage.removeItem(ADMIN_LOCK_KEY)
}

export function createAdminSession() {
  const session: SessionState = { exp: Date.now() + ADMIN_SESSION_MS }
  sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session))
}

export function hasAdminSession(): boolean {
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY)
    if (!raw) {
      return false
    }
    const parsed = JSON.parse(raw) as Partial<SessionState>
    if (typeof parsed.exp !== 'number' || parsed.exp < Date.now()) {
      clearAdminSession()
      return false
    }
    return true
  } catch {
    clearAdminSession()
    return false
  }
}

export function clearAdminSession() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY)
}

export function remainingAttempts(): number {
  if (isAdminLocked()) {
    return 0
  }
  return Math.max(0, ADMIN_MAX_ATTEMPTS - readLock().fails)
}
