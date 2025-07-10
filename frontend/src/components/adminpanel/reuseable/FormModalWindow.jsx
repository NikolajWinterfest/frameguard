import { useCallback, useEffect } from 'react'
import { useTheme } from '../../../context/ThemeContext'
import getAllDateFn from '../../../utils/dateProcessing'

const FormModalWindow = ({
  windowIsActiveForm,
  setWindowIsActiveForm,
  showDataForm,
}) => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  //__________________________________________________ HOOKS «useCallback's», «useEffect's» and EVENT HANDLER'S __________________________________________________//
  // useCallback // Close «Modal Window» on Button
  const handleBtnCloseModalWindow = useCallback(() => {
    setWindowIsActiveForm(false) // Close «Modal Window»

    document.body.classList.remove('stop-scroll-pr') // Deactivation «Stop Scroll»
  }, [setWindowIsActiveForm])

  // useEffect // Watching for Changes Modal Window
  useEffect(() => {
    // EVENT HANDLER // Close Modal Window on Button «Escape»
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        handleBtnCloseModalWindow()
      }
    }

    document.addEventListener('keydown', handleEscKey)

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [handleBtnCloseModalWindow])

  return (
    <div
      className={
        windowIsActiveForm ? 'formmodalwindow is-active' : 'formmodalwindow'
      }
    >
      <div
        className={
          windowIsActiveForm
            ? 'formmodalwindow__wrapper is-active'
            : 'formmodalwindow__wrapper'
        }
      >
        <div
          className={`formmodalwindow__content formmodalwindow-content ${systemTheme}-theme`}
        >
          <h4 className="formmodalwindow-content__title">ДАННЫЕ ФОРМЫ</h4>
          <div className="formmodalwindow-content__information-block information-block">
            <div className="information-block__id information-wrapblock">
              <div className="information-block__id-title infoblock-title">
                &#8470;:
              </div>
              <div className="information-block__id-info infoblock-info">
                {showDataForm.index}
              </div>
            </div>
            <div className="information-block__name information-wrapblock">
              <div className="information-block__name-title infoblock-title">
                Имя:
              </div>
              <div className="information-block__name-info infoblock-info">
                {showDataForm.name}
              </div>
            </div>
            <div className="information-block__uniqueid information-wrapblock">
              <div className="information-block__uniqueid-title infoblock-title">
                ID:
              </div>
              <div className="information-block__uniqueid-info infoblock-info">
                {showDataForm.id}
              </div>
            </div>
            <div className="information-block__date information-wrapblock">
              <div className="information-block__date-title infoblock-title">
                Дата обращения:
              </div>
              <div className="information-block__date-info infoblock-info">
                {getAllDateFn(showDataForm.date)}
              </div>
            </div>
            <div className="information-block__email information-wrapblock">
              <div className="information-block__email-title infoblock-title">
                E-mail:
              </div>
              <div className="information-block__email-info infoblock-info">
                {showDataForm.email}
              </div>
            </div>
            <div className="information-block__phone information-wrapblock">
              <div className="information-block__phone-title infoblock-title">
                Номер телефона:
              </div>
              <div className="information-block__phone-info infoblock-info">
                {showDataForm.phone}
              </div>
            </div>
            <div className="information-block__description information-wrapblock">
              <div className="information-block__description-title infoblock-title">
                Обращение:
              </div>
              <div className="information-block__description-info infoblock-info">
                {showDataForm.textarea}
              </div>
            </div>
            <div className="information-block__count information-wrapblock">
              <div className="information-block__count-title infoblock-title">
                Количество файлов:
              </div>
              <div className="information-block__count-info infoblock-info">
                {showDataForm.countfiles ? showDataForm.countfiles : 0}
              </div>
            </div>
          </div>
          <div className="formmodalwindow-content__closebtnwrap wrapbutton-close-theme">
            <button
              onClick={handleBtnCloseModalWindow}
              className="formmodalwindow-content__btn button-close-theme btn-reset"
            ></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FormModalWindow
