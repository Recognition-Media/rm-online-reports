import { test } from 'node:test'
import assert from 'node:assert/strict'
import { makeDots } from './dots.ts'

test('dots are deterministic and stay on the canvas', () => {
  const a = makeDots(80, 31)
  assert.deepEqual(a, makeDots(80, 31))
  assert.equal(a.length, 80)
  for (const d of a) {
    assert.ok(d.x >= 0 && d.x <= 1440 && d.y >= 0 && d.y <= 900)
    assert.ok(d.r > 0 && d.o > 0 && d.o <= 1)
  }
})
