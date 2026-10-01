import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'whatsapp' | 'ghost' | 'gold'

type CommonProps = {
  variant?: Variant
  icon?: ReactNode
  className?: string
  children?: ReactNode
}

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'href'> & {
    href?: undefined
  }

type ButtonAsLink = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string
  }

type ButtonProps = ButtonAsButton | ButtonAsLink

const variants: Record<Variant, string> = {
  primary:
    'bg-magenta text-white shadow-[0_8px_18px_rgba(201,0,104,0.18)] hover:bg-pink-intense',
  secondary:
    'bg-white text-magenta border border-magenta hover:bg-pink-soft/60',
  whatsapp:
    'bg-whatsapp text-white shadow-[0_8px_18px_rgba(37,211,102,0.22)] hover:bg-whatsapp-dark',
  ghost: 'bg-transparent text-plum hover:bg-pink-soft/50',
  gold: 'bg-gold text-white hover:brightness-95',
}

export function Button({
  variant = 'primary',
  className = '',
  icon,
  children,
  ...rest
}: ButtonProps) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${className}`

  if ('href' in rest && rest.href) {
    return (
      <a {...rest} className={classes}>
        {icon}
        {children}
      </a>
    )
  }

  const buttonRest = rest as ButtonHTMLAttributes<HTMLButtonElement>
  return (
    <button type={buttonRest.type ?? 'button'} {...buttonRest} className={classes}>
      {icon}
      {children}
    </button>
  )
}
