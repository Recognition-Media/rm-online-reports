import type { StopModule as Module } from '../types'
import { SliderReveal } from './SliderReveal'
import { SplitStat } from './SplitStat'
import { RankedBars } from './RankedBars'
import { CaseStudy } from './CaseStudy'
import { Takeaways } from './Takeaways'

export function StopModule({ module }: { module: Module }) {
  switch (module.type) {
    case 'slider':
      return <SliderReveal m={module} />
    case 'split':
      return <SplitStat m={module} />
    case 'bars':
      return <RankedBars m={module} />
    case 'case':
      return <CaseStudy m={module} />
    case 'takeaways':
      return <Takeaways m={module} />
  }
}
