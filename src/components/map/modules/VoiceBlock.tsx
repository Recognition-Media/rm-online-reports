import type { MapContent, StopVoice } from '../types'

export function VoiceBlock({ voice, labels }: { voice: StopVoice; labels: MapContent['labels'] }) {
  if (voice.kind === 'quote') {
    const q = voice.quote
    return (
      <figure className="map-voice map-voice-quote">
        <blockquote>“{q.text}”</blockquote>
        <figcaption>
          <strong>{q.name}</strong>
          {q.role ? `, ${q.role}` : ''}
        </figcaption>
      </figure>
    )
  }
  const v = voice.video
  return (
    <figure className="map-voice map-voice-video">
      {v.url ? (
        <div className="map-video">
          <iframe src={v.url} title={v.speaker} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen />
        </div>
      ) : (
        <div className="map-video map-video-placeholder">
          <span>{labels.videoSoon}</span>
        </div>
      )}
      <figcaption>
        <strong>{v.speaker}</strong>
        {v.role ? `, ${v.role}` : ''}
        {v.length ? ` · ${v.length}` : ''}
      </figcaption>
      {v.quote && <blockquote>“{v.quote}”</blockquote>}
    </figure>
  )
}
