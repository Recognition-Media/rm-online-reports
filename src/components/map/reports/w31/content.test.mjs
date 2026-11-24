import { test } from 'node:test'
import assert from 'node:assert/strict'
import { content, poleCopy } from './content.ts'
import { validateStops } from '../../modules/validate.ts'
import { pillRect } from '../../ringGeometry.ts'

test('six stops, numbered 01–06 in tour order, with valid data', () => {
  assert.deepEqual(content.stops.map((s) => s.number), ['01', '02', '03', '04', '05', '06'])
  assert.deepEqual(validateStops(content.stops), [])
})

test('the Q10 slider uses 69 for now', () => {
  const slider = content.stops.find((s) => s.module.type === 'slider')
  assert.equal(slider.module.value, 69)
})

test('Takeaways is the last stop and is a takeaways module', () => {
  assert.equal(content.stops.at(-1).module.type, 'takeaways')
})

test('both poles have copy entries', () => {
  for (const p of ['meaning', 'form']) assert.ok(poleCopy[p] && poleCopy[p].definition.length > 0, p)
})

test('stop pills never overlap each other', () => {
  const rects = content.stops.map(pillRect)
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
    const a = rects[i], b = rects[j]
    const apart = a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y
    assert.ok(apart, `${content.stops[i].number} overlaps ${content.stops[j].number}`)
  }
})
