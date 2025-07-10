import { useCallback, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'
import TemporaryPhotoStub from './TemporaryPhotoStub'

const EmployeeCardWindow = ({
  employee,
  windowIsActive,
  setWindowIsActive,
  photoEmployee,
  photoNameEmployee,
}) => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  //__________________________________________________ VARIABLES and FUNCTION __________________________________________________//
  // VARIABLES // Destructuring an object «Employee» and creating variables
  const {
    id,
    name,
    surname,
    workposition,
    description,
    experience,
    image,
    gender,
  } = employee

  // FUNCTION // Formatting the spelling of age
  const formatAge = (age) => {
    if (age.toString().endsWith('1')) {
      return `${age} год`
    } else if (Number(age) > 1 && age < 5) {
      return `${age} года`
    } else if (Number(age) > 4) {
      return `${age} лет`
    }
  }

  //__________________________________________________ HOOKS «useCallback» and «useEffect» __________________________________________________//
  // useCallback // Close «Modal window»
  const handleCloseModalWindow = useCallback(
    (event) => {
      if (
        event.target.classList.contains('employees__modalwindow') ||
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
      onClick={handleCloseModalWindow}
      className={
        windowIsActive
          ? 'employees__modalwindow employees-modalwindow is-active'
          : 'employees__modalwindow employees-modalwindow'
      }
    >
      <div key={id} className="employees-modalwindow__card card">
        <div className="card__content employee-card">
          {image && (
            <img
              className={
                image
                  ? 'employee-card__photo'
                  : 'employee-card__photo invisible'
              }
              src={`${photoEmployee(image, gender)}`}
              alt={photoNameEmployee(image, name, surname)}
            />
          )}
          <TemporaryPhotoStub name={name} image={image} mwMode={true} />
          <div className={`employee-card__information ${systemTheme}-theme`}>
            <div className="employee-card__name">
              {name.toUpperCase()}&ensp;{surname.toUpperCase()}
            </div>
            <div className="employee-card__workposition">
              <span className="employee-card__workposition-title">
                ДОЛЖНОСТЬ:
              </span>
              {workposition}
            </div>
            <div className="employee-card__experience">
              <span className="employee-card__experience-title">
                ОПЫТ РАБОТЫ:
              </span>
              {formatAge(experience)}
            </div>
            <p className="employee-card__description">
              <span className="employee-card__description-title">
                ОПИСАНИЕ:
              </span>
              {description}
            </p>
            <div className="employee-card__closebtnwrap wrapbutton-close">
              <button
                onClick={handleBtnCloseModalWindow}
                className="employee-card__btn button-close btn-reset"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeCardWindow
