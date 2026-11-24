import type { TakeawaysModule } from '../types'

export function Takeaways({ m }: { m: TakeawaysModule }) {
  return (
    <div className="map-mod map-mod-takeaways">
      <h2>{m.title}</h2>
      <ol>
        {m.items.map((t, i) => (
          <li key={t.headline}>
            <span className="map-mod-num">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3>{t.headline}</h3>
              <p>{t.line}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
