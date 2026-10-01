export function withBase(path: string): string {
  if (
    !path ||
    path.startsWith('data:') ||
    path.startsWith('blob:') ||
    /^(https?:|mailto:|tel:)/i.test(path)
  ) {
    return path
  }

  if (path.startsWith('#')) {
    return path
  }

  const base = import.meta.env.BASE_URL || '/'
  const root = base.endsWith('/') ? base.slice(0, -1) : base
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${root}${normalized}`
}

export function routerBasename(): string | undefined {
  const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')
  return base || undefined
}

export function stripBase(path: string): string {
  if (!path || path.startsWith('data:') || path.startsWith('blob:')) {
    return path
  }

  const base = import.meta.env.BASE_URL || '/'
  if (base !== '/' && path.startsWith(base)) {
    return `/${path.slice(base.length)}`
  }

  return path
}
