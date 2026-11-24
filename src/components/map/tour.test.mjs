import { test } from 'node:test'
import assert from 'node:assert/strict'
import { nextStep, prevStep } from './tour.ts'

const steps = ['a', 'b', 'c']

test('nextStep: closed → first stop → … → closes after the last', () => {
  assert.equal(nextStep(steps, null), 'a')
  assert.equal(nextStep(steps, 'a'), 'b')
  assert.equal(nextStep(steps, 'c'), null)
  assert.equal(nextStep(steps, 'unknown'), 'a')
})

test('prevStep: goes back one; nothing before the first stop', () => {
  assert.equal(prevStep(steps, 'c'), 'b')
  assert.equal(prevStep(steps, 'a'), null)
  assert.equal(prevStep(steps, null), null)
})
