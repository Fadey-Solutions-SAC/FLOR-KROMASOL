type StockBadgeProps = {
  stock: number
}

export function StockBadge({ stock }: StockBadgeProps) {
  if (stock <= 0) {
    return (
      <span className="rounded-full bg-plum px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
        Agotado
      </span>
    )
  }

  if (stock <= 4) {
    return (
      <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
        {stock === 1 ? 'Última unidad' : `Quedan ${stock}`}
      </span>
    )
  }

  return (
    <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-plum">
      {stock} en stock
    </span>
  )
}
