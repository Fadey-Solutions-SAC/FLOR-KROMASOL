import { useEffect } from 'react'

type ToastProps = {
  message: string | null
  onClose: () => void
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    if (!message) {
      return
    }

    const timer = window.setTimeout(onClose, 2600)
    return () => window.clearTimeout(timer)
  }, [message, onClose])

  if (!message) {
    return null
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="animate-toast-in pointer-events-none fixed bottom-24 left-1/2 z-[70] w-[min(92vw,360px)] -translate-x-1/2 rounded-full bg-plum px-5 py-3 text-center text-sm font-medium text-white shadow-[0_10px_30px_rgba(91,18,72,0.25)]"
    >
      {message}
    </div>
  )
}
