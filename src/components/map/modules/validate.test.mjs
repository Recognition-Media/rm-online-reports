import { test } from 'node:test'
import assert from 'node:assert/strict'
import { validateStops, assertValidStops } from './validate.ts'

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
  assert.equal(errs.length, 4)
  for (const id of ['s', 'p', 'b', 't']) assert.ok(errs.some((e) => e.includes(`stop "${id}"`)), id)
})

test('assertValidStops throws with every mistake listed', () => {
  assert.throws(() => assertValidStops([stop('a', '01', bars([101]))]), /content\.ts[\s\S]*stop "a"/)
})
