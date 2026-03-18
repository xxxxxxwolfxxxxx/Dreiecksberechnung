const fmt = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 4 })

export function formatNumber(value: number): string {
  return fmt.format(value)
}

export function formatUnit(value: number, unit: string, power = 1): string {
  const superscript = power === 2 ? '²' : power === 3 ? '³' : ''
  return `${formatNumber(value)} ${unit}${superscript}`
}
