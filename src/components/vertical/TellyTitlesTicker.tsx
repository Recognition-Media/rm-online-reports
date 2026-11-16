'use client'

import type { Report } from '@/sanity/types'

// Telly-only scrolling ticker surfacing "WHO'S BEHIND THE BEST VIDEO WORK"
// — this used to be the first ranked-list column in TellyFacts ("The
// Facts"); moved here per Ann's request, between the Table of Contents
// ("Just Released") and the first trend section (Shows & Series), as a
// slim always-moving banner instead of a static list. Removed from
// TellyFacts.tsx so the two don't duplicate the same content.

// Three pixel-art icons pulled from the Telly "Social Assets" Figma page
// (Icon Star, Icon Video, Icon Pixels), recolored to the ticker's blue
// (#0C75FF) and used as cycling separators between titles.
function StarIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 90.2806 90.2806" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M71.2565 39.971V27.2216H81.8782V17.4256H71.2207V21.2873H60.599V29.0135H52.6114V21.2873H49.3277V10.5472H47.2028V3.85052H42.4438V10.5472H40.3189V21.2873H37.0352V29.0135H29.5403V21.2873H18.9158V17.4256H8.2583V27.2216H18.8828V39.971H29.5045V50.2019H18.8828V62.9513H8.2583V72.7473H18.9158V68.8856H29.5403V61.1594H37.5279V68.8856H40.8116V79.6257H42.9365V86.3224H47.6927V79.6257H49.8176V68.8856H53.1013V61.1594H60.599V68.8856H71.2207V72.7473H81.8782V62.9513H71.2565V50.2019H60.6348V39.971H71.2565Z"
        fill="#0C75FF"
      />
    </svg>
  )
}

function VideoIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size * (66.1782 / 106.875)} viewBox="0 0 106.875 66.1782" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M85.4907 50.9898L85.4907 15.3984L95.4685 15.3984L95.4685 50.9898L85.4907 50.9898Z" fill="#0C75FF" />
      <path d="M76.5698 46.511L76.5698 19.8782L93.041 19.8782L93.041 46.511L76.5698 46.511Z" fill="#0C75FF" />
      <path d="M69.5186 42.1536L69.5186 24.2346L87.8116 24.2346L87.8116 42.1536L69.5186 42.1536Z" fill="#0C75FF" />
      <path d="M61.5747 37.2332L61.5747 29.1588L95.3881 29.1588L95.3881 37.2332L61.5747 37.2332Z" fill="#0C75FF" />
      <path d="M14.9873 55.0869L14.9873 11.3044L69.9045 11.3044L69.9045 55.0869L14.9873 55.0869Z" fill="#0C75FF" />
    </svg>
  )
}

function PixelsIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size * (104.317 / 167.856)} viewBox="0 0 167.856 104.317" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M101.942 18.4473H138.686V41.153H101.942V18.4473Z" fill="#0C75FF" />
      <path d="M29.1468 18.4473H65.8908V41.153H29.1468V18.4473Z" fill="#0C75FF" />
      <path d="M65.5428 40.834H102.287V63.5397H65.5428V40.834Z" fill="#0C75FF" />
      <path d="M101.942 63.2206H138.686V85.9263H101.942V63.2206Z" fill="#0C75FF" />
      <path d="M29.1468 63.2206H65.8908V85.9263H29.1468V63.2206Z" fill="#0C75FF" />
      <path d="M54.2858 56.0897H113.547V71.0889H54.2858V56.0897Z" fill="#0C75FF" />
      <path d="M54.2858 33.2798H113.547V48.279H54.2858V33.2798Z" fill="#0C75FF" />
    </svg>
  )
}

const TICKER_ICONS = [StarIcon, VideoIcon, PixelsIcon]

export function TellyTitlesTicker({ report }: { report: Report }) {
  const heading = report.factsTopTitlesHeading || "Who's Behind the Best Video Work"
  const items = report.factsTopTitles

  if (!items || items.length === 0) return null

  return (
    // Near-full-width section break between About and Credits. A small
    // horizontal inset rather than true full bleed, so the blue stroke that
    // now wraps the whole bar isn't sliced off at the viewport edges.
    <section className="relative py-5 px-4 md:px-6" style={{ background: '#110E1F' }}>
      <div className="w-full">
        {/* The stroke wraps the entire bar — label and scrolling track
            together — rather than just the label pill. */}
        <div
          className="telly-ticker flex items-stretch overflow-hidden rounded-xl"
          style={{ border: '2px solid #0C75FF' }}
        >
          {/* Label segment: a translucent dark wash rather than flat black,
              so it reads as a tinted panel instead of a hard slab. The
              stroke lives on the bar around it, not here. */}
          <div
            className="flex-shrink-0 flex items-center gap-2.5 whitespace-nowrap px-4 md:px-6 py-3"
            style={{
              // Blue-tinted translucent panel rather than flat black — a
              // plain dark wash reads as a hard slab here, because the
              // section behind it is already near-black so transparency
              // alone changes nothing. Tinting toward the bar's own stroke
              // colour ties the two together.
              background: 'rgba(12, 117, 255, 0.18)',
              fontFamily: "'Basetica', -apple-system, sans-serif",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: 1.3,
              color: '#0C75FF',
              textTransform: 'uppercase',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: 999, background: '#0C75FF', flexShrink: 0 }} />
            {heading}
          </div>

          <div className="relative flex-1 overflow-hidden flex items-center min-w-0" style={{ background: '#D8F5FF' }}>
            <div className="telly-ticker-track flex items-center gap-7 whitespace-nowrap py-3 pr-7 w-max">
              {[...items, ...items].map((item, i) => {
                const Icon = TICKER_ICONS[i % TICKER_ICONS.length]
                return (
                  <span key={i} className="flex items-center gap-7">
                    <span
                      className="text-[13px] md:text-[14px] font-medium"
                      style={{ fontFamily: "'Basetica', -apple-system, sans-serif", color: '#110E1F' }}
                    >
                      {item}
                    </span>
                    <Icon size={16} />
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
