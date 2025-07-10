import { useCallback, useEffect } from 'react'
import { useTheme } from '../../context/ThemeContext'

const SendFormModalWindow = ({
  sendFormModalWindow,
  setSendFormModalWindow,
  modalWindowData,
  setModalWindowData,
}) => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  //__________________________________________________ HOOKS «useCallback» and «useEffect» __________________________________________________//
  // EVENT HANDLER // Close modal window on Button
  const handleBtnCloseMW = useCallback(() => {
    setSendFormModalWindow(false)
    setModalWindowData({
      name: '',
      email: '',
      textarea: '',
      phone: '',
      files: '',
    })
    document.body.classList.remove('stop-scroll-pr') // Deactivation «Stop Scroll»
  }, [setSendFormModalWindow, setModalWindowData])

  // useEffect //
  useEffect(() => {
    const handleKeyCloseMW = (e) => {
      if (e.key === 'Escape') {
        handleBtnCloseMW()
      }
    }

    document.addEventListener('keydown', handleKeyCloseMW)
  }, [handleBtnCloseMW])

  // useEffect // Monitoring a click outside the «SendForm Modal Window»
  useEffect(() => {
    if (sendFormModalWindow) {
      const handleOutsideClick = (e) => {
        const wrapModalWindow = document.querySelector(
          '.modalwindowform__wrapper'
        )

        // Show «Shake Animation» if mouse click is outside the «Modal Window»
        if (!wrapModalWindow.classList.contains('shake')) {
          if (!wrapModalWindow.contains(e.target)) {
            wrapModalWindow.classList.add('shake') // Add Class «shake» for «Modal Window»
            setTimeout(() => {
              wrapModalWindow.classList.remove('shake') // Remove Class «shake» from «Modal Window»
            }, 500)
          }
        }
      }

      document.addEventListener('mouseup', handleOutsideClick)

      return () => {
        document.removeEventListener('mouseup', handleOutsideClick)
      }
    }
  }, [sendFormModalWindow])

  return (
    <div
      className={
        sendFormModalWindow ? 'modalwindowform is-active' : 'modalwindowform'
      }
    >
      <div className="modalwindowform__wrapper">
        <div
          className={`modalwindowform__content modalwindowform-content ${systemTheme}-theme`}
        >
          <h4 className="modalwindowform-content__title tertiary-title">
            ДАННЫЕ ОТПРАВЛЕНЫ
          </h4>
          <div
            className={`modalwindowform-content__infowrap modalwindowform-infowrap ${systemTheme}-theme`}
          >
            <div className="modalwindowform-infowrap__name">
              <span className="modalwindowform-infowrap__name-title">ИМЯ:</span>
              <span className="modalwindowform-infowrap__name-descr">
                {modalWindowData.name}
              </span>
            </div>
            <div className="modalwindowform-infowrap__email">
              <span className="modalwindowform-infowrap__email-title">
                ПОЧТА:
              </span>
              <span className="modalwindowform-infowrap__email-descr">
                {modalWindowData.email}
              </span>
            </div>
            <div className="modalwindowform-infowrap__phone">
              <span className="modalwindowform-infowrap__phone-title">
                НОМЕР ТЕЛЕФОНА:
              </span>
              <span className="modalwindowform-infowrap__phone-descr">
                {modalWindowData.phone}
              </span>
            </div>
            <div className="modalwindowform-infowrap__description">
              <span className="modalwindowform-infowrap__description-title">
                ОПИСАНИЕ:
              </span>
              <span className="modalwindowform-infowrap__description-descr">
                {modalWindowData.textarea}
              </span>
            </div>
            <div className="modalwindowform-infowrap__files">
              <span className="modalwindowform-infowrap__files-title">
                ФАЙЛЫ:
              </span>
              <span className="modalwindowform-infowrap__files-descr">
                {modalWindowData.files || 0}
              </span>
            </div>
          </div>
          <div className="modalwindowform-content__closebtnwrap wrapbutton-close-theme">
            <button
              onClick={handleBtnCloseMW}
              className={`modalwindowform-content__closebtnwrap-btn button-close-theme btn-reset ${systemTheme}-theme`}
            ></button>
          </div>
          <div className="modalwindowform-content__okbtnwrap">
            <button
              onClick={handleBtnCloseMW}
              className={`modalwindowform-content__okbtnwrap-btn btn-reset ${systemTheme}-theme`}
            >
              ОК
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SendFormModalWindow
