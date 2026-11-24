import type { RankedBarsModule } from '../types'

export function RankedBars({ m }: { m: RankedBarsModule }) {
  const bars = [...m.bars].sort((a, b) => b.value - a.value)
  return (
    <div className="map-mod map-mod-bars">
      <p className="map-mod-source">{m.source}</p>
      <ol className="map-bars">
        {bars.map((b) => (
          <li key={b.label}>
            <span className="map-bars-label">{b.label}</span>
            <span className="map-bars-track" aria-hidden="true">
              <span className="map-bars-fill" style={{ width: `${b.value}%` }} />
            </span>
            <span className="map-mod-num">{b.value}%</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
