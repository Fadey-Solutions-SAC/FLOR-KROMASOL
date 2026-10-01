import { Minus, Plus } from 'lucide-react'

type QuantitySelectorProps = {
  value: number
  min?: number
  max?: number
  onDecrease: () => void
  onIncrease: () => void
  label?: string
}

export function QuantitySelector({
  value,
  min = 1,
  max,
  onDecrease,
  onIncrease,
  label = 'Cantidad',
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center gap-3">
      {label ? <span className="text-sm font-medium text-plum">{label}</span> : null}
      <div className="inline-flex items-center rounded-full border border-pink-soft bg-white">
        <button
          type="button"
          aria-label="Disminuir cantidad"
          onClick={onDecrease}
          disabled={value <= min}
          className="flex h-10 w-10 items-center justify-center rounded-full text-plum transition duration-200 hover:bg-pink-soft disabled:opacity-40"
        >
          <Minus size={16} />
        </button>
        <span className="min-w-8 text-center text-sm font-semibold">{value}</span>
        <button
          type="button"
          aria-label="Aumentar cantidad"
          onClick={onIncrease}
          disabled={typeof max === 'number' && value >= max}
          className="flex h-10 w-10 items-center justify-center rounded-full text-plum transition duration-200 hover:bg-pink-soft disabled:opacity-40"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}
