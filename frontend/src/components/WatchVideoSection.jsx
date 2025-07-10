import { useEffect } from 'react'
import { useState } from 'react'

const WatchVideoSection = () => {
  //__________________________________________________ HOOKS «useState's» __________________________________________________//
  // useState // Object Video with various values
  const [playing, setPlaying] = useState(false)
  //__________________________________________________ VARIABLES and FUNCTION __________________________________________________//
  // VARIABLE // ID Links YouTube

  // VARIABLE // YoutTube Settings

  //__________________________________________________ EVENT HANDLER'S __________________________________________________//
  // EVENT HANDLER // Play Video on click
  const handleTogglePlayPause = () => {
    const video = document.getElementById('videoPlayer')
    if (playing) {
      video.pause()
    } else {
      video.play()
    }
    setPlaying(!playing)
  }

  // useEffect // Watching for changes State «playing»
  useEffect(() => {
    setPlaying(true)
  }, [])

  return (
    <section className="watchvideo">
      <div className="watchvideo__wrapper container">
        <h2 className="watchvideo__title secondary-title">ЗАГОЛОВОК</h2>
        <div className="watchvideo__content">
          <video
            onClick={handleTogglePlayPause}
            id="videoPlayer"
            className="watchvideo__content-video"
            src="/assets/videos/video.mp4"
            controls={false}
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </section>
  )
}

export default WatchVideoSection
