import assert from 'node:assert/strict'
import { projectCurrentStreak, projectWeeklyProgress } from '../src/contexts/personal-insights/application/wellbeingProjection.js'

const referenceDate = new Date(2026, 7, 13, 12)

assert.deepEqual(projectCurrentStreak([], referenceDate), {
  days: 0,
  value: '—',
  detail: 'Sin racha activa',
  capped: false,
})

assert.equal(projectCurrentStreak([
  { date: '2026-08-13', count: 2 },
  { date: '2026-08-12', count: 1 },
  { date: '2026-08-11', count: 3 },
], referenceDate).value, '3 días')

assert.deepEqual(projectCurrentStreak([
  { date: '2026-08-12', count: 1 },
  { date: '2026-08-11', count: 1 },
], referenceDate), {
  days: 2,
  value: '2 días',
  detail: 'Registrá hoy para mantenerla',
  capped: false,
})

assert.equal(projectCurrentStreak([
  { date: '2026-08-11', count: 1 },
], referenceDate).days, 0)

assert.deepEqual(projectWeeklyProgress(null), {
  value: '—',
  detail: 'Sin registros esta semana',
  direction: 'empty',
})

assert.deepEqual(projectWeeklyProgress({
  current: { entries: 3, averageScore: 8 },
  previous: { entries: 0, averageScore: 0 },
  difference: { averageScore: 8, percentage: null },
}), {
  value: 'Nuevo',
  detail: 'Promedio 8/10 esta semana',
  direction: 'new',
})

assert.equal(projectWeeklyProgress({
  current: { entries: 4, averageScore: 7.5 },
  previous: { entries: 3, averageScore: 6 },
  difference: { averageScore: 1.5, percentage: 25 },
}).value, '+25%')

assert.equal(projectWeeklyProgress({
  current: { entries: 2, averageScore: 5 },
  previous: { entries: 4, averageScore: 8 },
  difference: { averageScore: -3, percentage: -37.5 },
}).direction, 'down')

console.log('PersonalInsights wellbeing projection tests: OK')
