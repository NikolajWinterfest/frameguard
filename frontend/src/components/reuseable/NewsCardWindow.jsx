import { useCallback, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import getAllDateFn from '../../utils/dateProcessing'

const NewsCard = ({ windowIsActive, setWindowIsActive, newsCard }) => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()
  //__________________________________________________ VARIABLES and FUNCTION __________________________________________________//
  // VARIABLES // Destructuring an object «News» and creating variables
  const { id, title, description, image, creationDate } = newsCard

  //__________________________________________________ HOOK'S useCallback, useEffect and EVENT HANDLER'S __________________________________________________//
  // EVENT HANDLER // Scroll to Top
  const handleScrollToTop = () => {
    document.querySelector('.newsline-modalwindow__wrapper').scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // useCallback // Close «Modal Window» on key «Escape»
  const handleCloseModalWindow = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        setWindowIsActive(false) // Modal window is OFF
        document.body.classList.remove('stop-scroll-pr') // Deactivation «Stop Scroll»
      }
    },
    [setWindowIsActive]
  )

  // EVENT HANDLER // Close «Modal Window» on Button
  const handleBtnCloseModalWindow = () => {
    setWindowIsActive(false) // Modal window is OFF
    document.body.classList.remove('stop-scroll-pr') // Deactivation «Stop Scroll»
  }

  // useEffect // Watching for Changes in «handleCloseModalWindow»
  useEffect(() => {
    document.addEventListener('keydown', handleCloseModalWindow)

    return () => document.removeEventListener('keydown', handleCloseModalWindow)
  }, [handleCloseModalWindow])

  return (
    <div
      className={
        windowIsActive
          ? 'newsline__modalwindow newsline-modalwindow is-active'
          : 'newsline__modalwindow newsline-modalwindow'
      }
    >
      <div className={`newsline-modalwindow__wrapper ${systemTheme}-theme`}>
        <div key={id} className="newsline-modalwindow__card card-news">
          <div className={`card-news__photowrapper ${systemTheme}-theme`}>
            <img
              className="card-news__photowrapper-photo"
              src={image ? `${process.env.REACT_APP_API_URL}${image}` : '/assets/images/other/placeholder.jpg'}
              alt="Фотография"
            />
          </div>
          <div className="card-news__text-content text-content">
            <h3 className={`text-content__title ${systemTheme}-theme`}>
              {title.toUpperCase()}
            </h3>
            <div
              className={`text-content__datepublication ${systemTheme}-theme`}
            >
              {getAllDateFn(creationDate)}
            </div>
            <p className={`text-content__description ${systemTheme}-theme`}>
              {description}
            </p>
          </div>
          {false && <button onClick={handleScrollToTop}>To Top</button>}
        </div>
        <div className="newsline-modalwindow__closebtnwrap wrapbutton-close-theme">
          <button
            onClick={handleBtnCloseModalWindow}
            className={`newsline-modalwindow__btn button-close-theme btn-reset ${systemTheme}-theme`}
          ></button>
        </div>
      </div>
    </div>
  )
}

export default NewsCard
