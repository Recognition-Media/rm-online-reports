import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  CANVAS,
  formatShare,
  poleLabels,
  autoPosition,
  validateThemes,
  computeThemeStats,
  rankPole,
} from './themeMath.ts'

const t = (id, pole, count, extra = {}) => ({
  id, name: id, pole, count, color: '#000', ink: '#fff', shape: 'none', line: '', answers: [], ...extra,
})

test('formatShare rounds to whole percents and marks tiny shares', () => {
  assert.equal(formatShare(0.129), '13%')
  assert.equal(formatShare(0.0034), '<1%')
  assert.equal(formatShare(0), '0%')
})

test('pole labels always sum to 100', () => {
  assert.deepEqual(poleLabels(176, 102), { meaning: '63%', form: '37%' })
  assert.deepEqual(poleLabels(101, 99), { meaning: '51%', form: '49%' })
  assert.deepEqual(poleLabels(0, 0), { meaning: '0%', form: '0%' })
})

test('computeThemeStats derives total, shares, labels and pole totals from counts', () => {
  const s = computeThemeStats([t('a', 'meaning', 30), t('b', 'meaning', 10), t('c', 'form', 60)])
  assert.equal(s.total, 100)
  assert.equal(s.themes.find((x) => x.id === 'c').label, '60%')
  assert.equal(s.poles.meaning.count, 40)
  assert.equal(s.poles.meaning.label, '40%')
  assert.equal(s.poles.form.label, '60%')
})

test('changing one count updates every derived number', () => {
  const before = computeThemeStats([t('a', 'meaning', 50), t('b', 'form', 50)])
  const after = computeThemeStats([t('a', 'meaning', 150), t('b', 'form', 50)])
  assert.equal(before.poles.meaning.label, '50%')
  assert.equal(after.poles.meaning.label, '75%')
  assert.equal(after.total, 200)
  // b's share fell from 50% to 25%, so its blob shrinks
  assert.ok(after.themes[1].size < before.themes[1].size)
})

test('zero total renders 0% with no NaN', () => {
  const s = computeThemeStats([t('a', 'meaning', 0), t('b', 'form', 0)])
  assert.equal(s.total, 0)
  for (const x of s.themes) {
    assert.equal(x.label, '0%')
    assert.equal(x.size, 0)
    assert.ok(Number.isFinite(x.share))
  }
  assert.equal(s.poles.meaning.label, '0%')
})

test('blob area tracks share: the largest theme gets maxBlob, zero gets 0, small ones get at least minBlob', () => {
  const s = computeThemeStats([t('big', 'meaning', 100), t('quarter', 'form', 25), t('tiny', 'form', 1), t('none', 'form', 0)])
  const by = Object.fromEntries(s.themes.map((x) => [x.id, x.size]))
  assert.equal(by.big, CANVAS.maxBlob)
  assert.equal(by.quarter, Math.round(CANVAS.maxBlob * 0.5))
  assert.equal(by.tiny, CANVAS.minBlob)
  assert.equal(by.none, 0)
})

test('auto position stays in its half', () => {
  for (let i = 0; i < 12; i++) {
    const m = autoPosition(i, 'meaning')
    const f = autoPosition(i, 'form')
    assert.ok(m.x < CANVAS.divider && m.x > 0, `meaning ${i} x=${m.x}`)
    assert.ok(f.x > CANVAS.divider && f.x < CANVAS.width, `form ${i} x=${f.x}`)
    assert.ok(m.y > 0 && m.y < CANVAS.height)
  }
})

test('explicit positions win over auto positions', () => {
  const s = computeThemeStats([t('a', 'meaning', 1, { position: { x: 10, y: 20 } }), t('b', 'form', 1)])
  assert.deepEqual([s.themes[0].x, s.themes[0].y], [10, 20])
  assert.ok(s.themes[1].x > CANVAS.divider)
})

test('rankPole sorts one side by count, ties by name', () => {
  const s = computeThemeStats([t('b', 'meaning', 5), t('a', 'meaning', 5), t('c', 'meaning', 9), t('z', 'form', 99)])
  assert.deepEqual(rankPole(s, 'meaning').map((x) => x.id), ['c', 'a', 'b'])
})

test('validateThemes catches data-entry mistakes', () => {
  assert.deepEqual(validateThemes([t('a', 'meaning', 1), t('b', 'form', 2)]), [])
  const errs = validateThemes([
    t('a', 'meaning', 1),
    t('a', 'form', 2),
    t('b', 'meaning', -1),
    t('c', 'meaning', 1.5),
    t('d', 'middle', 1),
  ])
  assert.equal(errs.length, 4)
  assert.ok(errs.some((e) => e.includes('duplicate id "a"')))
  assert.ok(errs.some((e) => e.includes('"b"') && e.includes('count')))
  assert.ok(errs.some((e) => e.includes('"c"') && e.includes('count')))
  assert.ok(errs.some((e) => e.includes('"d"') && e.includes('pole')))
})
