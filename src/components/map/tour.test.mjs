import { test } from 'node:test'
import assert from 'node:assert/strict'
import { INTRO, tourSteps, nextStep, prevStep } from './tour.ts'

const steps = tourSteps(['a', 'b', 'c'])

test('the tour starts with the intro card, then the stops in order', () => {
  assert.deepEqual(steps, [INTRO, 'a', 'b', 'c'])
})

test('nextStep: closed → intro → stops → closes after the last', () => {
  assert.equal(nextStep(steps, null), INTRO)
  assert.equal(nextStep(steps, INTRO), 'a')
  assert.equal(nextStep(steps, 'b'), 'c')
  assert.equal(nextStep(steps, 'c'), null)
  assert.equal(nextStep(steps, 'unknown'), INTRO)
})

test('prevStep: goes back one, and closes from the intro or when closed', () => {
  assert.equal(prevStep(steps, 'c'), 'b')
  assert.equal(prevStep(steps, 'a'), INTRO)
  assert.equal(prevStep(steps, INTRO), null)
  assert.equal(prevStep(steps, null), null)
})
