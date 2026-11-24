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

test('assertValidThemes throws on bad data so the page build fails loudly', async () => {
  const { assertValidThemes } = await import('./themeMath.ts')
  assert.doesNotThrow(() => assertValidThemes([t('a', 'meaning', 1)]))
  assert.throws(() => assertValidThemes([t('a', 'meaning', 1), t('a', 'form', -12)]), /themes\.ts[\s\S]*duplicate id "a"[\s\S]*count/)
})

test('spreadPositions pushes blobs away from the center of their side', async () => {
  const { spreadPositions } = await import('./themeMath.ts')
  const s = computeThemeStats([
    t('a', 'meaning', 10, { position: { x: 350, y: 450 } }),
    t('b', 'meaning', 10, { position: { x: 500, y: 600 } }),
  ])
  const out = spreadPositions(s, 1.5)
  // side center is (425, 525); each blob ends up 1.5× as far from it
  assert.deepEqual([out.themes[0].x, out.themes[0].y], [313, 413])
  assert.deepEqual([out.themes[1].x, out.themes[1].y], [538, 638])
})

test('spreadPositions never lets a blob cross the center line', async () => {
  const { spreadPositions } = await import('./themeMath.ts')
  const s = computeThemeStats([
    t('m1', 'meaning', 50, { position: { x: 400, y: 450 } }),
    t('m2', 'meaning', 50, { position: { x: 700, y: 450 } }),
    t('f1', 'form', 50, { position: { x: 740, y: 450 } }),
    t('f2', 'form', 50, { position: { x: 1000, y: 450 } }),
  ])
  for (const b of spreadPositions(s, 1.15).themes) {
    if (b.pole === 'meaning') assert.ok(b.x + b.size / 2 <= CANVAS.divider, `${b.id} right edge ${b.x + b.size / 2}`)
    else assert.ok(b.x - b.size / 2 >= CANVAS.divider, `${b.id} left edge ${b.x - b.size / 2}`)
  }
})

test('blobs under 7% (as shown) are the soft ones; 7% and up stay sharp', async () => {
  const { isSoftBlob } = await import('./themeMath.ts')
  const s = computeThemeStats([t('a', 'meaning', 64), t('b', 'meaning', 66), t('c', 'form', 870)])
  // a = 6.4% → shows 6% → soft; b = 6.6% → shows 7% → sharp; c = 87% → sharp
  assert.deepEqual(s.themes.map(isSoftBlob), [true, false, false])
})
