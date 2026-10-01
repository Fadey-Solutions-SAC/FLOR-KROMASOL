export function BerryMotif({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 180 180"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="54" cy="62" r="18" fill="#C90068" opacity="0.12" />
      <circle cx="78" cy="48" r="14" fill="#E91E8C" opacity="0.16" />
      <circle cx="72" cy="76" r="12" fill="#5B1248" opacity="0.1" />
      <path
        d="M96 38c18 8 26 24 22 42"
        stroke="#C90068"
        strokeWidth="2"
        opacity="0.18"
      />
      <path
        d="M118 92c12-18 32-22 46-12"
        stroke="#D9A441"
        strokeWidth="1.5"
        opacity="0.35"
      />
    </svg>
  )
}
