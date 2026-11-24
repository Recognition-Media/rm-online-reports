// Pure tour order for the map template: intro card first, then each stop.
// `null` means no pop-up is open.

export const INTRO = 'intro'

export function tourSteps(stopIds: string[]): string[] {
  return [INTRO, ...stopIds]
}

export function nextStep(steps: string[], current: string | null): string | null {
  if (current === null) return steps[0] ?? null
  const i = steps.indexOf(current)
  if (i === -1) return steps[0] ?? null
  return i + 1 < steps.length ? steps[i + 1] : null
}

export function prevStep(steps: string[], current: string | null): string | null {
  if (current === null) return null
  const i = steps.indexOf(current)
  return i > 0 ? steps[i - 1] : null
}
