import type { SplitStatModule } from '../types'

export function SplitStat({ m }: { m: SplitStatModule }) {
  return (
    <div className="map-mod map-mod-split">
      <p className="map-mod-source">{m.source}</p>
      <p className="map-mod-big">{m.headline}%</p>
      <p className="map-mod-label">{m.headlineLabel}</p>
      <div className="map-split" aria-hidden="true">
        {m.parts.map((p) => <span key={p.label} style={{ flexBasis: `${p.value}%` }} />)}
      </div>
      <ul className="map-mod-list">
        {m.parts.map((p) => (
          <li key={p.label}>
            <span className="map-mod-num">{p.value}%</span>
            {p.label}
          </li>
        ))}
      </ul>
    </div>
  )
}
