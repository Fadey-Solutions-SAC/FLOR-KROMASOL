export const CATEGORIES = [
  'Todos',
  'Suplementos',
  'Vitaminas y minerales',
  'Proteínas',
  'Fibra',
  'Bienestar',
] as const

export type CategoryName = (typeof CATEGORIES)[number]

export const PRODUCT_SECTIONS = CATEGORIES.filter(
  (item): item is Exclude<CategoryName, 'Todos'> => item !== 'Todos',
)
