const shortDateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

function parseTrendDate(value) {
  if (!value) return null
  const parsed = new Date(`${value}T12:00:00`)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function cleanShortDate(value) {
  return shortDateFormatter.format(value).replace(/\./g, '').replace(/\sde\s/g, ' ')
}

export function formatTrendRange(items = []) {
  const dates = items.map(item => parseTrendDate(item?.date)).filter(Boolean).sort((a, b) => a - b)
  if (!dates.length) return ''

  const first = dates[0]
  const last = dates[dates.length - 1]
  const firstText = cleanShortDate(first)
  const lastText = cleanShortDate(last)

  return firstText === lastText ? `El ${firstText}` : `Del ${firstText} al ${lastText}`
}

export function summarizeTrend(items = []) {
  const validItems = items
    .map(item => ({
      ...item,
      count: Math.max(0, Number(item?.count) || 0),
      score: Number(item?.averageScore),
      date: parseTrendDate(item?.date),
    }))
    .filter(item => item.date && Number.isFinite(item.score))

  if (!validItems.length) return 'Todav\u00eda no hay registros en este periodo.'

  const totalEntries = validItems.reduce((total, item) => total + item.count, 0)
  const weightedScore = validItems.reduce((total, item) => total + (item.score * (item.count || 1)), 0)
  const scoreDivisor = validItems.reduce((total, item) => total + (item.count || 1), 0)
  const average = (weightedScore / scoreDivisor).toFixed(1)
  const best = validItems.reduce((current, item) => item.score > current.score ? item : current, validItems[0])
  const bestDate = cleanShortDate(best.date)
  const entriesLabel = totalEntries === 1 ? 'registro' : 'registros'
  const daysLabel = validItems.length === 1 ? 'd\u00eda' : 'd\u00edas'

  return `${totalEntries || validItems.length} ${entriesLabel} en ${validItems.length} ${daysLabel}. Promedio del periodo: ${average}/10. Mejor d\u00eda: ${bestDate}, ${best.score}/10.`
}
