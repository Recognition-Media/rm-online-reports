'use client'

import { useRef, useState } from 'react'
import { assetPath } from '@/lib/assetPath'
import type { MapContent, Video } from './types'

/** Square clip; speaker + Watch/Pause button sit underneath it (Anthem pattern). */
export function FeatureVideo({ video, labels }: { video: Video; labels: MapContent['labels'] }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  if (!video.src) return null
  const toggle = () => (playing ? ref.current?.pause() : ref.current?.play())

  return (
    <figure className="map-feature-video">
      <video
        ref={ref}
        src={assetPath(video.src)}
        playsInline
        preload="metadata"
        aria-label={video.speaker}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onClick={toggle}
      />
      <figcaption className="map-feature-video-bar">
        <span>
          <strong>{video.speaker}</strong>
          {video.role && <span>{video.role}</span>}
        </span>
        <button type="button" className="map-btn map-btn-primary map-video-toggle" onClick={toggle}>
          <span aria-hidden="true">{playing ? '❚❚' : '▶'}</span> {playing ? labels.pauseVideo : labels.watchVideo}
        </button>
      </figcaption>
    </figure>
  )
}
