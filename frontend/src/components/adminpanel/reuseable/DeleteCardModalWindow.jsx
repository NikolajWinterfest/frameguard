import { useCallback, useEffect } from 'react'
import { useTheme } from '../../../context/ThemeContext'

const DeleteCardModalWindow = ({
  windowIsActiveDelete,
  setWindowIsActiveDelete,
  removeCardData,
  handleDeleteCard,
  handleDeleteForm,
}) => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  // useCallback // Close «Question Card» modal window
  const handleCloseModalWindow = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        setWindowIsActiveDelete(false)
        document.body.classList.remove('stop-scroll-pr') // Deactivation «Stop Scroll»
      }
    },
    [setWindowIsActiveDelete]
  )

  // EVENT HANDLER // Delete Card (isForm = true «Delete Form Card», isForm = false «Delete Another Card»)
  const handleDeleteAnyCard = () => {
    if (removeCardData.cardType === 'forms') {
      handleDeleteForm(removeCardData.id) // Do you want to delete this «Old Form Card»
      setWindowIsActiveDelete(false)
      document.body.classList.remove('stop-scroll-pr') // Deactivation «Stop Scroll»
    } else {
      handleDeleteCard(removeCardData.cardType, removeCardData.id) // Do you want to delete this «Old Card» in «REDUX Store»?
      setWindowIsActiveDelete(false)
      document.body.classList.remove('stop-scroll-pr') // Deactivation «Stop Scroll»
    }
  }

  // useEffect // Watching for Changes «Question Card» modal window
  useEffect(() => {
    document.addEventListener('keydown', handleCloseModalWindow)

    return () => {
      document.removeEventListener('keydown', handleCloseModalWindow)
    }
  }, [handleCloseModalWindow])

  // useEffect // Monitoring a click outside the «Question Card»
  useEffect(() => {
    if (windowIsActiveDelete) {
      const handleOutsideClick = (e) => {
        const wrapModalWindow = document.querySelector(
          '.smallmodalwindow__wrapper'
        )

        // Show «Shake Animation» if mouse click is outside the «Question Card»
        if (!wrapModalWindow.classList.contains('shake')) {
          if (!wrapModalWindow.contains(e.target)) {
            wrapModalWindow.classList.add('shake') // Add Class «shake» for «Question Card»
            setTimeout(() => {
              wrapModalWindow.classList.remove('shake') // Remove Class «shake» from «Question Card»
            }, 500)
          }
        }
      }

      document.addEventListener('mouseup', handleOutsideClick)

      return () => {
        document.removeEventListener('mouseup', handleOutsideClick)
      }
    }
  }, [windowIsActiveDelete])

  return (
    <div
      className={
        windowIsActiveDelete ? 'smallmodalwindow is-active' : 'smallmodalwindow'
      }
    >
      <div className={`smallmodalwindow__wrapper ${systemTheme}-theme`}>
        <div className="smallmodalwindow__content smallmodalwindow-card">
          <h3 className={`smallmodalwindow-card__title ${systemTheme}-theme`}>
            ВЫ ДЕЙСТВИТЕЛЬНО ХОТИТЕ УДАЛИТЬ КАРТОЧКУ?
          </h3>
          <div className="smallmodalwindow-card__wrapperbuttons">
            <button
              onClick={() => {
                setWindowIsActiveDelete(false)
                document.body.classList.remove('stop-scroll-pr') // Deactivation «Stop Scroll»
              }}
              className={`smallmodalwindow-card__wrapperbuttons-reject btn-reset ${systemTheme}-theme`}
            >
              НЕТ
            </button>
            <button
              onClick={handleDeleteAnyCard}
              className={`smallmodalwindow-card__wrapperbuttons-confirm btn-reset ${systemTheme}-theme`}
            >
              УДАЛИТЬ
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DeleteCardModalWindow
