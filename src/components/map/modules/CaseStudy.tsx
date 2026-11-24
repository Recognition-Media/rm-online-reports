import type { CaseStudyModule } from '../types'

export function CaseStudy({ m }: { m: CaseStudyModule }) {
  return (
    <div className="map-mod map-mod-case">
      <h3>{m.title}</h3>
      <p>{m.body}</p>
    </div>
  )
}
