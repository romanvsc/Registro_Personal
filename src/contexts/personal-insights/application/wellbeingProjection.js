function toIsoDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function shiftIsoDate(isoDate, offset) {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + offset)
  return date.toISOString().slice(0, 10)
}

function validTrendDates(items) {
  return new Set((Array.isArray(items) ? items : [])
    .filter(item => Number(item?.count) > 0 && /^\d{4}-\d{2}-\d{2}$/.test(item?.date || ''))
    .map(item => item.date))
}

export function projectCurrentStreak(items, referenceDate = new Date()) {
  const dates = validTrendDates(items)
  const today = toIsoDate(referenceDate)
  const yesterday = shiftIsoDate(today, -1)
  const anchor = dates.has(today) ? today : dates.has(yesterday) ? yesterday : null

  if (!anchor) {
    return { days: 0, value: '—', detail: 'Sin racha activa', capped: false }
  }

  let days = 0
  let cursor = anchor
  while (dates.has(cursor)) {
    days += 1
    cursor = shiftIsoDate(cursor, -1)
  }

  const capped = days >= 365
  return {
    days,
    value: capped ? '365+ días' : `${days} ${days === 1 ? 'día' : 'días'}`,
    detail: anchor === today ? 'Registraste hoy' : 'Registrá hoy para mantenerla',
    capped,
  }
}

function formatAverage(value) {
  const average = Number(value)
  return Number.isFinite(average) ? average.toFixed(1).replace('.0', '') : '—'
}

export function projectWeeklyProgress(comparison) {
  const currentEntries = Number(comparison?.current?.entries) || 0
  const previousEntries = Number(comparison?.previous?.entries) || 0
  const currentAverage = Number(comparison?.current?.averageScore) || 0
  const previousAverage = Number(comparison?.previous?.averageScore) || 0

  if (!currentEntries) {
    return { value: '—', detail: 'Sin registros esta semana', direction: 'empty' }
  }

  if (!previousEntries || previousAverage <= 0) {
    return {
      value: 'Nuevo',
      detail: `Promedio ${formatAverage(currentAverage)}/10 esta semana`,
      direction: 'new',
    }
  }

  const rawPercentage = Number(comparison?.difference?.percentage)
  const percentage = Number.isFinite(rawPercentage)
    ? rawPercentage
    : ((currentAverage - previousAverage) / previousAverage) * 100
  const rounded = Math.round(percentage * 10) / 10
  const formatted = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)

  return {
    value: `${rounded > 0 ? '+' : ''}${formatted}%`,
    detail: 'Promedio vs. semana anterior',
    direction: rounded > 0 ? 'up' : rounded < 0 ? 'down' : 'same',
  }
}
