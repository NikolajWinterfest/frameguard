import { useTheme } from '../../context/ThemeContext'

const SpecialOffer = ({
  showSpecialOffer,
  setShowSpecialOffer,
  scrollToContacts,
}) => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  // EVENT HANDLER // Scroll to Contacts
  const handleClick = () => {
    scrollToContacts()
    setShowSpecialOffer((prev) => !prev)
  }

  return (
    <div
      className={
        showSpecialOffer
          ? `specialoffer ${systemTheme}-theme is-active`
          : `specialoffer ${systemTheme}-theme`
      }
    >
      <div className={`specialoffer__content ${systemTheme}-theme`}>
        <h3 className={`specialoffer__title ${systemTheme}-theme`}>
          Хочешь попробовать? оставь контакт для получения пробной версии!
        </h3>
        <button
          onClick={handleClick}
          className={`specialoffer__form-btn btn-reset ${systemTheme}-theme`}
        >
          Оставить контакт
        </button>
        <div className="specialoffer__wrapbutton wrapbutton-close-theme">
          <button
            onClick={() => setShowSpecialOffer(false)}
            className={`specialoffer__wrapbutton-btn button-close-theme btn-reset ${systemTheme}-theme`}
          ></button>
        </div>
      </div>
    </div>
  )
}

export default SpecialOffer
