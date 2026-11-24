import { test } from 'node:test'
import assert from 'node:assert/strict'
import { themes } from './themes.ts'
import { validateThemes, computeThemeStats } from './themeMath.ts'

test('seed data is valid', () => {
  assert.deepEqual(validateThemes(themes), [])
})

test('seed data matches the JSON, everyone (376 coded answers, 64/36)', () => {
  const s = computeThemeStats(themes)
  assert.equal(themes.length, 18)
  assert.equal(s.total, 376)
  assert.equal(s.poles.meaning.label, '64%')
  assert.equal(s.poles.form.label, '36%')
  // Humour is 47/376 = 12.5% exactly: shows as 13%
  assert.equal(s.themes.find((t) => t.id === 'humour').label, '13%')
})
