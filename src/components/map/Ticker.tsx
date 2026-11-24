import type { TickerItem } from './types'

// Scrolling strip of things people remembered. Rendered twice so the
// -50% scroll loops seamlessly.
export function Ticker({ label, items }: { label: string; items: TickerItem[] }) {
  const doubled = [...items, ...items]
  return (
    <div className="map-ticker">
      <p className="map-ticker-label">{label}</p>
      <div className="map-ticker-window" aria-hidden="true">
        <div className="map-ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="map-ticker-item">
            <span className="map-ticker-dot" style={{ background: item.color }} />
            {item.text}
          </span>
        ))}
        </div>
      </div>
    </div>
  )
}
