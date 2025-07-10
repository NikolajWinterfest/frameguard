import { useTheme } from '../../context/ThemeContext'

const AdminPanelForm = ({
  dataForms,
  cardType,
  setWindowIsActiveForm,
  setShowDataForm,
  setRemoveCardData,
  setWindowIsActiveDelete,
}) => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  // EVENT HANDLER // Show «Form Card»
  const handleShowCardForm = (value, index) => {
    setShowDataForm({ ...value, index })
    setWindowIsActiveForm(true)
    document.body.classList.add('stop-scroll-pr') // Activation «Stop Scroll»
  }

  return (
    <div className="adminpanel-datalist__forms datalist-forms">
      <h3 className="datalist-forms__title adminpanel-title">ФОРМЫ</h3>
      <ul className="datalist-forms__list">
        {dataForms.map((showData, index) => {
          const { id, name, email, phone } = showData

          return (
            <li
              key={id}
              className={`datalist-forms__item item-forms ${systemTheme}-theme`}
            >
              <div className="item-forms__headgroup">
                <div
                  className={`item-forms__headgroup-item form-id ${systemTheme}-theme`}
                >
                  &#8470;: {index + 1}
                </div>
                <div className="item-forms__headgroup-item form-name">
                  {name}
                </div>
              </div>
              <div className="item-forms__secondgroup">
                <div className="item-forms__secondgroup-text">Email:</div>
                <div className="item-forms__secondgroup-item form-email">
                  {email}
                </div>
              </div>
              <div className="item-forms__thirdgroup">
                <div className="item-forms__thirdgroup-text form-phone">
                  Phone:
                </div>
                <div className="item-forms__thirdgroup-item form-phone">
                  {phone}
                </div>
              </div>
              <div className="item-forms__wrapperbuttons wrapperbuttons-forms">
                <button
                  onClick={() => handleShowCardForm(showData, index)}
                  className={`wrapperbuttons-forms__btn-show btn-reset ${systemTheme}-theme`}
                >
                  ПОДРОБНЕЕ
                </button>
                <button
                  onClick={() => {
                    setRemoveCardData({ cardType: cardType, id: id }) // Delete «Old Card» in «REDUX Store»
                    setWindowIsActiveDelete(true)
                    document.body.classList.add('stop-scroll-pr') // Activation «Stop Scroll»
                  }}
                  className={`wrapperbuttons-forms__btn-delete btn-reset ${systemTheme}-theme`}
                >
                  УДАЛИТЬ
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default AdminPanelForm
