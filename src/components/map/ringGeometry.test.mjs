import { test } from 'node:test'
import assert from 'node:assert/strict'
import { PILL_HEIGHT, pillLabel, pillWidth, pillRect, circleHitsRect, fitZoom } from './ringGeometry.ts'

const origin = { x: 720, y: 470 }

test('pillRect is centered on the stop position and sized from its label', () => {
  const s = { number: '01', title: 'Abc', position: { x: 200, y: 300 } }
  const w = pillWidth(pillLabel(s))
  assert.deepEqual(pillRect(s), { x: 200 - w / 2, y: 300 - PILL_HEIGHT / 2, w, h: PILL_HEIGHT })
  assert.ok(pillWidth('a much longer label') > pillWidth('short'))
})

test('circleHitsRect includes padding', () => {
  const r = { x: 0, y: 0, w: 10, h: 10 }
  assert.equal(circleHitsRect({ x: 30, y: 5, r: 5 }, r, 0), false)
  assert.equal(circleHitsRect({ x: 30, y: 5, r: 5 }, r, 16), true)
})

test('fitZoom keeps the max zoom when nothing collides', () => {
  assert.equal(fitZoom([{ x: 720, y: 470, r: 50 }], [{ x: 0, y: 0, w: 40, h: 40 }], origin, 1.2), 1.2)
})

test('fitZoom steps down until no circle touches a pill', () => {
  // At 1.2 this circle lands on the pill; it clears it from 1.07 down.
  const circle = { x: 200, y: 470, r: 10 }
  const rect = { x: 60, y: 450, w: 80, h: 40 }
  const z = fitZoom([circle], [rect], origin, 1.2)
  assert.equal(z, 1.07)
  const zc = { x: origin.x + (circle.x - origin.x) * z, y: origin.y + (circle.y - origin.y) * z, r: circle.r * z }
  assert.equal(circleHitsRect(zc, rect, 12), false)
})

test('fitZoom bottoms out at min when the pill covers the center', () => {
  assert.equal(fitZoom([{ x: 720, y: 470, r: 10 }], [{ x: 700, y: 450, w: 40, h: 40 }], origin, 1.2), 0.6)
})
