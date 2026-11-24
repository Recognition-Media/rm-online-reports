'use client'

import { useRef, useState } from 'react'
import { assetPath } from '@/lib/assetPath'
import type { MapContent, Video } from './types'

/** Square clip with our own Watch / Pause buttons (no browser controls). */
export function FeatureVideo({ video, labels }: { video: Video; labels: MapContent['labels'] }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  if (!video.src) return null

  return (
    <figure className={`map-feature-video${playing ? ' is-playing' : ''}`}>
      <video
        ref={ref}
        src={assetPath(video.src)}
        playsInline
        preload="metadata"
        aria-label={video.speaker}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onClick={() => (playing ? ref.current?.pause() : ref.current?.play())}
      />
      {playing ? (
        <button type="button" className="map-btn map-btn-primary map-video-pause" onClick={() => ref.current?.pause()}>
          <span aria-hidden="true">❚❚</span> {labels.pauseVideo}
        </button>
      ) : (
        <button type="button" className="map-btn map-btn-primary map-video-watch" onClick={() => ref.current?.play()}>
          <span aria-hidden="true">▶</span> {labels.watchVideo}
        </button>
      )}
    </figure>
  )
}
