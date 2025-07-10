import { useTheme } from '../../context/ThemeContext'

const AdminPanelCard = ({
  cards = [],
  cardType,
  modalWindowBtnCreateCard,
  modalWindowBtnChangeCard,
  setRemoveCardData,
  setWindowIsActiveDelete,
}) => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  //__________________________________________________ EVENT HANDLER'S and FUNCTION'S __________________________________________________//
  // EVENT HANDLER // SHOW «Preview Image» in Card List (src link)
  const handleShowPreviewImage = (cardType, image, gender) => {

    const serverImage = process.env.REACT_APP_API_URL+image;
    if (cardType === 'news') {
      return image ? serverImage : `/assets/images/other/placeholder.jpg`
    }

    if (cardType === 'employees') {
      photoEmployee()

      return image ? serverImage : photoEmployee(image, gender)
    }

    if (cardType === 'projects') {
      return image ? serverImage : '/assets/images/other/placeholder.jpg'
    }
  }

  // FUNCTION // Photo blank for man and woman
  const photoEmployee = (image, gender) => {
    if (image !== '') {
      return image
    } else if (gender === 'female') {
      return '/assets/aboutus/person-woman.jpg'
    } else {
      return '/assets/aboutus/person-man.jpg'
    }
  }

  // FUNCTION // Defining the title type
  const cardTypeName = () => {
    if (cardType === 'news') return 'ЛЕНТА'
    if (cardType === 'employees') return 'СОТРУДНИКИ'
    if (cardType === 'projects') return 'ПРОЕКТЫ'
  }

  return (
    <div className="adminpanel-datalist__cards datalist-cards">
      <h3 className="datalist-cards__title adminpanel-title">
        {cardTypeName()}
      </h3>
      <ul className="datalist-cards__list">
        {cards.map((card) => {
          const { id, name, surname, gender, image, title } = card
          return (
            <li
              key={id}
              className={
                cardType === 'employees'
                  ? `datalist-cards__item employee-width ${systemTheme}-theme`
                  : `datalist-cards__item ${systemTheme}-theme`
              }
            >
              <div className="datalist-cards__item-wrapperimage">
                <img
                  className="datalist-cards__item-image"
                  src={handleShowPreviewImage(cardType, image, gender)}
                  alt=""
                />
                <h3 className="datalist-cards__item-title">
                  {cardType === 'employees'
                    ? `${name.toUpperCase()} ${surname.toUpperCase()}`
                    : title.toUpperCase()}
                </h3>
              </div>
              <div className="datalist-cards__item-content datalist-card">
                <div className="datalist-card__wrapperbuttons">
                  <button
                    className="datalist-card__update-btn btn-reset"
                    onClick={() => modalWindowBtnChangeCard(cardType, card)}
                  >
                    ИЗМЕНИТЬ
                  </button>
                  <button
                    className="datalist-card__delete-btn btn-reset"
                    onClick={() => {
                      setRemoveCardData({ cardType: cardType, id: id }) // Delete «Old Card» in «REDUX Store»
                      setWindowIsActiveDelete(true)
                      document.body.classList.add('stop-scroll-pr') // Activation «Stop Scroll»
                    }}
                  >
                    УДАЛИТЬ
                  </button>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="datalist-cards__addcard">
        <button
          className="datalist-cards__addcard-btn btn-reset"
          onClick={() => modalWindowBtnCreateCard(cardType)}
        >
          ДОБАВИТЬ
        </button>
      </div>
    </div>
  )
}

export default AdminPanelCard
