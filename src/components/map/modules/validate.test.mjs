import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateStops, assertValidStops } from './validate.ts'
import { INTRO } from '../tour.ts'

const stop = (id, number, module) => ({ id, number, title: id, position: { x: 0, y: 0 }, copy: [], module })
const bars = (values) => ({ type: 'bars', source: '', bars: values.map((value) => ({ label: 'x', value })) })

test('valid stops pass', () => {
  assert.deepEqual(validateStops([stop('a', '01', bars([10, 20])), stop('b', '02', { type: 'takeaways', title: '', items: [{ headline: 'h', line: 'l' }] })]), [])
})

test('catches duplicate ids and numbers', () => {
  const errs = validateStops([stop('a', '01', bars([1])), stop('a', '01', bars([1]))])
  assert.ok(errs.some((e) => e.includes('duplicate stop id "a"')))
  assert.ok(errs.some((e) => e.includes('duplicate stop number "01"')))
})

test('catches percentages outside 0–100 and empty lists', () => {
  const errs = validateStops([
    stop('s', '01', { type: 'slider', source: '', question: '', minLabel: '', maxLabel: '', value: 690, valueLabel: '', lines: [], revealButton: '', guessLabel: '' }),
    stop('p', '02', { type: 'split', source: '', headline: 57, headlineLabel: '', parts: [{ label: 'x', value: -3 }] }),
    stop('b', '03', bars([])),
    stop('t', '04', { type: 'takeaways', title: '', items: [] }),
  ])
  // 5: the split's single -3% part is out of range AND doesn't add up to 100
  assert.equal(errs.length, 5)
  for (const id of ['s', 'p', 'b', 't']) assert.ok(errs.some((e) => e.includes(`stop "${id}"`)), id)
})

test('assertValidStops throws with every mistake listed', () => {
  assert.throws(() => assertValidStops([stop('a', '01', bars([101]))]), /content\.ts[\s\S]*stop "a"/)
})

test('split parts must add up to ~100 and have 1–4 parts', () => {
  const split = (parts) => stop('s', '01', { type: 'split', source: '', headline: 57, headlineLabel: '', parts: parts.map((value) => ({ label: 'x', value })) })
  assert.deepEqual(validateStops([split([34, 23, 29, 14])]), [])
  assert.ok(validateStops([split([43, 23, 29, 14])]).some((e) => e.includes('add up')), 'sum 109')
  assert.ok(validateStops([split([])]).some((e) => e.includes('1–4 parts')), 'empty')
  assert.ok(validateStops([split([20, 20, 20, 20, 20])]).some((e) => e.includes('1–4 parts')), 'five')
})

test('a stop cannot use the reserved id "intro" and needs a position on the canvas', () => {
  const ok = stop('a', '01', bars([1]))
  const errs = validateStops([
    { ...ok, id: 'intro', number: '02' },
    { ...ok, id: 'b', number: '03', position: { x: NaN, y: 10 } },
    { ...ok, id: 'c', number: '04', position: { x: 1600, y: 10 } },
  ])
  assert.ok(errs.some((e) => e.includes('"intro"')))
  assert.ok(errs.some((e) => e.includes('stop "b"') && e.includes('position')))
  assert.ok(errs.some((e) => e.includes('stop "c"') && e.includes('position')))
})

test('the reserved id matches the tour intro marker', () => {
  assert.ok(validateStops([stop(INTRO, '01', bars([1]))]).some((e) => e.includes(`"${INTRO}"`)))
})
