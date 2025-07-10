import { useCallback, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'

const ProjectCardWindow = ({
  projectCard,
  windowIsActive,
  setWindowIsActive,
}) => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  //__________________________________________________ VARIABLES and FUNCTION __________________________________________________//
  // VARIABLES // Destructuring an object «Project» and creating variables
  const { title, description, image, company } = projectCard

  //__________________________________________________ HOOK'S useCallback and useEffect __________________________________________________//
  // useCallback // Close «Modal window»
  const handleCloseModalWindow = useCallback(
    (event) => {
      if (
        event.target.classList.contains('project__modalwindow') ||
        event.key === 'Escape'
      ) {
        setWindowIsActive(false) // Modal window is OFF
        document.body.classList.remove('stop-scroll-pr') // Deactivation «Stop Scroll»
      }
    },
    [setWindowIsActive]
  )

  // useEffect // Watching for Changes in «handleCloseModalWindow»
  useEffect(() => {
    document.addEventListener('keydown', handleCloseModalWindow)

    return () => document.removeEventListener('keydown', handleCloseModalWindow)
  }, [handleCloseModalWindow])

  //__________________________________________________ EVENT HANDLER'S __________________________________________________//
  // EVENT HANDLER // Close «Modal Window» on Button
  const handleBtnCloseModalWindow = () => {
    setWindowIsActive(false)
    document.body.classList.remove('stop-scroll-pr') // Deactivation «Stop Scroll»
  }

  return (
    <div
      onClick={(event) => handleCloseModalWindow(event)}
      className={
        windowIsActive
          ? 'project__modalwindow project-modalwindow is-active'
          : 'project__modalwindow project-modalwindow'
      }
    >
      <div className="project-modalwindow__card project-card">
        <div className="project-card__photowrapper">
          <img
            className="project-card__photowrapper-photo"
            src={image ? `${process.env.REACT_APP_API_URL}${image}` : '/assets/images/other/placeholder.jpg'}
            alt={`Обложка проекта компании ${company}`}
          />
        </div>
        <div className="project-card__information information-card">
          <h4 className={`information-card__title ${systemTheme}-theme`}>
            {title.toUpperCase()}
          </h4>
          <div className="information-card__companyname">{company}</div>
          <p className={`information-card__descr ${systemTheme}-theme`}>
            {description}
          </p>
          <div className="information-card__closebtnwrap wrapbutton-close">
            <button
              onClick={handleBtnCloseModalWindow}
              className="information-card__btn button-close btn-reset"
            ></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCardWindow
