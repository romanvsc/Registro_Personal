import assert from 'node:assert/strict'
import { getSafeRedirect } from '../src/contexts/identity-access/application/safeRedirect.js'
import { hasProfileChanges, snapshotProfileForm } from '../src/contexts/identity-access/application/profileForm.js'

assert.equal(getSafeRedirect('/historial?page=2'), '/historial?page=2')
assert.equal(getSafeRedirect('/'), '/')
assert.equal(getSafeRedirect('//example.test/phishing'), '/')
assert.equal(getSafeRedirect('https://example.test/phishing'), '/')
assert.equal(getSafeRedirect(['\/historial']), '/')
assert.equal(getSafeRedirect('', '/fallback'), '/fallback')

const baseline = snapshotProfileForm({ name: 'Ana', avatarKey: 'felipa', biography: 'Hola' })
const unchanged = { ...baseline, currentPassword: '', password: '', passwordConfirmation: '' }
assert.equal(hasProfileChanges(unchanged, baseline), false)
assert.equal(hasProfileChanges({ ...unchanged, biography: 'Nueva nota' }, baseline), true)
assert.equal(hasProfileChanges({ ...unchanged, password: 'secret' }, baseline), false)
assert.equal(hasProfileChanges({ ...unchanged, password: 'secret' }, baseline, true), true)

console.log('identity access helpers: ok')

