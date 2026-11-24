import type { TickerItem } from './types'

// Scrolling strip of things people remembered. Rendered twice so the
// -50% scroll loops seamlessly.
export function Ticker({ label, items, className }: { label: string; items: TickerItem[]; className?: string }) {
  const doubled = [...items, ...items]
  return (
    <div className={`map-ticker${className ? ` ${className}` : ''}`}>
      <p className="map-ticker-label">{label}</p>
      <div className="map-ticker-window" aria-hidden="true">
        <div className="map-ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="map-ticker-item">
            {item.text}
            <span className="map-ticker-dot" style={{ background: item.color }} />
          </span>
        ))}
        </div>
      </div>
    </div>
  )
}
