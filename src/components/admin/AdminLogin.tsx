import { useEffect, useId, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '../ui/Button'
import { useAdmin } from '../../context/AdminContext'

export function AdminLogin() {
  const { loginOpen, closeLogin, login, authError, authBusy } = useAdmin()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const usernameId = useId()
  const passwordId = useId()

  useEffect(() => {
    if (!loginOpen) {
      setUsername('')
      setPassword('')
      setHoneypot('')
    }
  }, [loginOpen])

  useEffect(() => {
    if (!loginOpen) {
      return
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !authBusy) {
        closeLogin()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [authBusy, closeLogin, loginOpen])

  if (!loginOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <button
        type="button"
        className="absolute inset-0 bg-plum/50"
        aria-label="Cerrar acceso"
        onClick={closeLogin}
        disabled={authBusy}
      />
      <form
        className="animate-fade-up relative w-full max-w-sm rounded-[1.6rem] bg-white p-6 shadow-2xl"
        autoComplete="off"
        onSubmit={(event) => {
          event.preventDefault()
          void login(username, password, honeypot)
        }}
      >
        <button
          type="button"
          onClick={closeLogin}
          disabled={authBusy}
          aria-label="Cerrar"
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-surface text-plum"
        >
          <X size={16} />
        </button>
        <h2 className="font-display text-2xl font-bold text-plum">Acceso privado</h2>
        <p className="mt-2 text-sm text-ink/65">
          Solo para administrar las imágenes del catálogo.
        </p>

        <div className="hidden" aria-hidden="true">
          <label>
            Sitio web
            <input
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
            />
          </label>
        </div>

        <label className="mt-5 block text-sm font-medium text-plum" htmlFor={usernameId}>
          Usuario
        </label>
        <input
          id={usernameId}
          name="admin-user"
          autoComplete="off"
          spellCheck={false}
          maxLength={64}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mt-2 h-12 w-full rounded-full border border-pink-soft bg-surface px-4 text-sm outline-none focus:border-magenta"
        />

        <label className="mt-4 block text-sm font-medium text-plum" htmlFor={passwordId}>
          Contraseña
        </label>
        <input
          id={passwordId}
          name="admin-pass"
          type="password"
          autoComplete="off"
          maxLength={64}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 h-12 w-full rounded-full border border-pink-soft bg-surface px-4 text-sm outline-none focus:border-magenta"
        />

        {authError && (
          <p className="mt-3 text-sm text-magenta" role="alert">
            {authError}
          </p>
        )}

        <Button type="submit" className="mt-5 w-full" disabled={authBusy}>
          {authBusy ? 'Verificando…' : 'Entrar'}
        </Button>
      </form>
    </div>
  )
}
