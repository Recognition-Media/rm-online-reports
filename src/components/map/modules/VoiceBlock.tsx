'use client'

import { useState } from 'react'
import type { MapContent, StopVoice } from '../types'

export function VoiceBlock({ voice, labels }: { voice: StopVoice; labels: MapContent['labels'] }) {
  const [playing, setPlaying] = useState(false)

  if (voice.kind === 'quote') {
    const q = voice.quote
    return (
      <figure className="map-voice map-voice-quote">
        <blockquote>“{q.text}”</blockquote>
        <figcaption>
          {q.name}
          {q.role ? `, ${q.role}` : ''}
        </figcaption>
      </figure>
    )
  }

  const v = voice.video
  return (
    <figure className="map-voice map-voice-video">
      {v.quote && <blockquote>“{v.quote}”</blockquote>}
      {playing && v.url ? (
        <div className="map-video">
          <iframe src={v.url} title={v.speaker} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        </div>
      ) : (
        <div className="map-video-row">
          <button
            type="button"
            className="map-video-thumb"
            onClick={() => v.url && setPlaying(true)}
            aria-disabled={!v.url}
            aria-label={`${labels.playVideo}: ${v.speaker}`}
          >
            <span className="map-video-play" aria-hidden="true">▶</span>
          </button>
          <figcaption>
            <strong>{v.speaker}</strong>
            {v.role && <span>{v.role}{v.length ? ` · ${v.length}` : ''}</span>}
            {!v.url && <span className="map-video-soon">{labels.videoSoon}</span>}
          </figcaption>
        </div>
      )}
    </figure>
  )
}
