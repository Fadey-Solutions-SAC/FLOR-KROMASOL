import { STORE_BRAND_LINE, STORE_NAME } from '../config/store'
import { Link } from 'react-router-dom'

type LogoProps = {
  compact?: boolean
  asLink?: boolean
}

export function Logo({ compact = false, asLink = true }: LogoProps) {
  const content = (
    <>
      <span
        className={`flex shrink-0 items-center justify-center rounded-full bg-magenta text-white shadow-[0_8px_18px_rgba(201,0,104,0.18)] ${compact ? 'h-10 w-10' : 'h-11 w-11'}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 32 32" className="h-6 w-6 fill-none" role="img">
          <path
            d="M16 4.5c.4 4.8 3.6 8.4 8 9.5-4.4 1.1-7.6 4.7-8 9.5-.4-4.8-3.6-8.4-8-9.5 4.4-1.1 7.6-4.7 8-9.5Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span className="leading-none">
        <span className="font-display block text-[1.15rem] font-bold tracking-tight text-plum">
          {STORE_NAME}
        </span>
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.22em] text-magenta">
          {STORE_BRAND_LINE}
        </span>
      </span>
    </>
  )

  const classes = 'flex items-center gap-3'

  if (!asLink) {
    return <div className={classes}>{content}</div>
  }

  return (
    <Link to="/" className={classes} aria-label={`${STORE_NAME} ${STORE_BRAND_LINE}, ir al inicio`}>
      {content}
    </Link>
  )
}
