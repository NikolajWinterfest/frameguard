import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useTheme } from '../../../context/ThemeContext'

const ModalWindowCreateChangeCard = ({
  cardType,
  cardSettings,
  windowIsActiveCreateChange,
  setWindowIsActiveCreateChange,
  createChangeSettings,
  changeValueData,
  resetAllInputFields,
  handleChangesInputValues,
  handleAddCard,
  handleUpdateCard,
  handleFileChange,
  selectedFile,
}) => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  //__________________________________________________ HOOKS «useState's» __________________________________________________//
  // useState // «Text Error» if Input Fields don't have value
  const [textError, setTextError] = useState(false)

  // useState // Show a red text if Inptu Field doesn't have Text
  const [submitted, setSubmitted] = useState(false)

  // useState // Make a red border if Input Field doesn't have Text
  const [inputError, setInputError] = useState({
    name: false,
    surname: false,
    experience: false,
    workposition: false,
    gender: false,
    title: false,
    description: false,
    company: false,
  })

  const [initImg, setInitImage] = useState('')

  // FILTER FUNCTION //
  const filteredInputFields = (cardType, inputValue) => {
    if (cardType === 'news') {
      return {
        id: inputValue.id,
        title: inputValue.title,
        description: inputValue.description,
        image: inputValue.image,
        creationDate: inputValue.creationDate,
      }
    }

    if (cardType === 'employees') {
      return {
        id: inputValue.id,
        name: inputValue.name,
        surname: inputValue.surname,
        experience: inputValue.experience,
        workposition: inputValue.workposition,
        gender: inputValue.gender,
        description: inputValue.description,
        image: inputValue.image,
        creationDate: inputValue.creationDate,
      }
    }

    if (cardType === 'projects') {
      return {
        id: inputValue.id,
        title: inputValue.title,
        description: inputValue.description,
        company: inputValue.company,
        image: inputValue.image,
        creationDate: inputValue.creationDate,
      }
    }
  }
  //__________________________________________________ HOOKS «useCallback's», «useEffect's» and EVENT HANDLER'S __________________________________________________//
  // useCallback // Check Validation of Input Fields
  const validateInputFields = useCallback(() => {
    // CHECK Input Value for all Cards
    if (!changeValueData.description) return false

    // CHECK Input Values for «Employee Card»
    if (cardType === 'employees') {
      if (
        !changeValueData.name ||
        !changeValueData.surname ||
        !changeValueData.experience ||
        !changeValueData.workposition ||
        !changeValueData.gender
      ) {
        return false
      }
    }

    // CHECK Input Values for «News Card» and «Project Card»
    if (cardType === 'news' || cardType === 'projects') {
      if (!changeValueData.title) return false
    }

    // CHECK Input Value for «Project Card»
    if (cardType === 'projects') {
      if (!changeValueData.company) return false
    }

    return true
  }, [changeValueData, cardType])

  // useEffect // Watching Changes in Input Fields
  useEffect(() => {
    if (submitted) {
      setTextError(!validateInputFields()) // Show and Hide «Text Error»

      // Iteration's over the array of «inputError»
      for (let key in changeValueData) {
        setInputError((prevData) => {
          if (!changeValueData[key]) {
            return { ...prevData, [key]: true }
          } else {
            return { ...prevData, [key]: false }
          }
        })
      }
    }
  }, [changeValueData, submitted, validateInputFields])

  // useCallback // Close «Modal Window» on Button
  const handleBtnCloseModalWindow = useCallback(() => {
    // Close «Modal Window»
    setWindowIsActiveCreateChange(false)
    document.body.classList.remove('stop-scroll-pr') // Deactivation «Stop Scroll»
    resetAllInputFields() // Reset all input fields in modal window Card
    // if (document.getElementById('preview')) {
    //   document.getElementById('preview').src = ""
    // }

    if (document.getElementById('preview')) {
      document.getElementById('preview').src = getPlaceholder(
        cardType,
        changeValueData.gender,
        changeValueData.image
      )
    }
    setTextError(false) // Hide «Text Error»
    setSubmitted(false) // Hide «Text Error» and «Red Borders»
    setInputError({
      name: false,
      surname: false,
      experience: false,
      workposition: false,
      gender: false,
      title: false,
      description: false,
      company: false,
    })
  }, [setWindowIsActiveCreateChange, resetAllInputFields])

  // useEffect // Watching for Changes Modal Window
  useEffect(() => {
    // EVENT HANDLER // Close Modal Window on Button «Escape»
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        handleBtnCloseModalWindow()
      }
    }

    if (
      document.getElementById('preview') &&
      typeof changeValueData.image === 'string' &&
      changeValueData.image.indexOf('/uploads/') === 0
    ) {
      document.getElementById('preview').src =
        process.env.REACT_APP_API_URL + changeValueData.image
    }

    document.addEventListener('keydown', handleEscKey)

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [handleBtnCloseModalWindow])

  // EVENT HANDLER // Send Data to «REDUX Store»
  const handleSubmitActionWithCard = (e) => {
    e.preventDefault()
    setSubmitted(true) // Show «Text Error» and «Red Borders»

    for (let key in changeValueData) {
      if (!changeValueData[key]) {
        setInputError((prevData) => {
          return { ...prevData, [key]: true }
        })
      }
    }
    // CHECK Input Values for «Employee Card», «Project Card» and «News Card»
    if (!validateInputFields()) {
      return setTextError(true)
    } // Show «Text Error»

    setTextError(false) // Hide «Text Error»

    // FILTER FUNCTION // Filter by cardType (Every card has unique input fields)
    const newCard = filteredInputFields(cardType, changeValueData)

    const formData = new FormData() // Adding variables to formData

    for (let key in newCard) {
      formData.append(key, newCard[key])
    }

    // Convert «FormData»
    const formDataToObject = (formData) => {
      const obj = {}
      for (let [key, value] of formData.entries()) {
        obj[key] = value
      }
      return obj
    }

    if (selectedFile) {
      formData.append('image', selectedFile)
    }

    // Boolean // «CREATE CARD (createChangeSettings = true)», «CHANGE CARD (createChangeSettings = false)»
    if (createChangeSettings) {
      const uniqueId = uuidv4() // Make «Unique ID» for «New Card»
      newCard.id = uniqueId
      const creationDate = new Date().toISOString() // Make «Data of Creating»
      newCard.creationDate = creationDate

      formData.append('id', uniqueId)
      formData.append('creationDate', creationDate)
      formData.append('cardType', cardType)

      const newFormData = formDataToObject(formData)
      //console.log(formData.forEach((item, index) => console.log(item[index])))

      handleAddCard(cardType, newFormData) // Add «New Card» to «REDUX Store»
    } else {
      if (
        !selectedFile &&
        typeof changeValueData.image === 'string' &&
        changeValueData.image.indexOf('/uploads/') === 0
      ) {
        formData.append('oldImage', changeValueData.image)
      }
      const newFormData = formDataToObject(formData)
      handleUpdateCard(cardType, newFormData) // Update «Old Card» in «REDUX Store»
    }

    handleBtnCloseModalWindow()
  }

  return (
    <div
      className={
        windowIsActiveCreateChange
          ? `adminpanel__modalwindow is-active ${systemTheme}-theme`
          : `adminpanel__modalwindow ${systemTheme}-theme`
      }
    >
      <div className="adminpanel__modalwindow-wrappercard adminpanel-card">
        <div className={`adminpanel-card__content ${systemTheme}-theme`}>
          <h3 className={`adminpanel-card__content-title ${systemTheme}-theme`}>
            {createChangeSettings ? 'ДОБАВИТЬ КАРТОЧКУ' : 'ИЗМЕНИТЬ КАРТОЧКУ'}
          </h3>
          <div
            className={
              textError
                ? 'adminpanel-card__content-texterror is-active'
                : 'adminpanel-card__content-texterror'
            }
          >
            Заполните все поля
          </div>
          <form
            onSubmit={handleSubmitActionWithCard}
            className="adminpanel-card__content-form adminpanel-cardform"
          >
            <div className="adminpanel-cardform__inputfields admin-inputfields">
              <figure className="loaded-image-container">
                <img
                  src={getPlaceholder(
                    cardType,
                    changeValueData.gender,
                    changeValueData.image
                  )}
                  id="preview"
                  alt="Preview"
                />
              </figure>

              <div
                className={`admin-inputfields__wrapperinput ${systemTheme}-theme`}
              >
                <span className="admin-inputfields__wrapperinput-text image-text">
                  {createChangeSettings
                    ? 'ДОБАВИТЬ ИЗОБРАЖЕНИЕ'
                    : 'ИЗМЕНИТЬ ИЗОБРАЖЕНИЕ'}
                </span>

                <input
                  key={changeValueData.id}
                  onChange={async (e) => {
                    const fileUrl = await handleFileChange(
                      e.target.name,
                      e.target.files?.[0]
                    )

                    if (fileUrl) {
                      document.getElementById('preview').src = fileUrl
                    }
                  }}
                  className="admin-inputfields__inputfile image-input"
                  type="file"
                  accept="image/*"
                  name="image"
                />
              </div>

              {cardSettings === 'employees' && (
                <div className="admin-inputfields__employeeblock employeeblock-inputfields">
                  <label className="employeeblock-inputfields__label">
                    <span
                      className={`employeeblock-inputfields__text inputfields-text name-text ${systemTheme}-theme`}
                    >
                      ИМЯ
                    </span>
                    <input
                      onChange={(e) =>
                        handleChangesInputValues(e.target.name, e.target.value)
                      }
                      className={
                        inputError.name
                          ? `employeeblock-inputfields__input inputfields-input name-input ${systemTheme}-theme error-input`
                          : `employeeblock-inputfields__input inputfields-input name-input ${systemTheme}-theme`
                      }
                      type="text"
                      name="name"
                      value={changeValueData.name}
                    />
                  </label>
                  <label className="employeeblock-inputfields__label">
                    <span
                      className={`employeeblock-inputfields__text inputfields-text surname-text ${systemTheme}-theme`}
                    >
                      ФАМИЛИЯ
                    </span>
                    <input
                      onChange={(e) =>
                        handleChangesInputValues(e.target.name, e.target.value)
                      }
                      className={
                        inputError.surname
                          ? `employeeblock-inputfields__input inputfields-input surname-input ${systemTheme}-theme error-input`
                          : `employeeblock-inputfields__input inputfields-input surname-input ${systemTheme}-theme`
                      }
                      type="text"
                      name="surname"
                      value={changeValueData.surname}
                    />
                  </label>
                  <div className="admin-inputfields__wrapperblock">
                    <label className="employeeblock-inputfields__label">
                      <span
                        className={`employeeblock-inputfields__text inputfields-text experience-text ${systemTheme}-theme`}
                      >
                        ОПЫТ
                      </span>
                      <input
                        onChange={(e) =>
                          handleChangesInputValues(
                            e.target.name,
                            e.target.value
                          )
                        }
                        className={
                          inputError.experience
                            ? `employeeblock-inputfields__input inputfields-input experience-input ${systemTheme}-theme error-input`
                            : `employeeblock-inputfields__input inputfields-input experience-input ${systemTheme}-theme`
                        }
                        type="number"
                        name="experience"
                        value={changeValueData.experience}
                        min="1"
                        max="40"
                      />
                    </label>
                    <label className="employeeblock-inputfields__label">
                      <span
                        className={`employeeblock-inputfields__text inputfields-text gender-text ${systemTheme}-theme`}
                      >
                        ПОЛ
                      </span>
                      <ul
                        className={
                          inputError.gender
                            ? `employeeblock-inputfields__label-choose choose-gender ${systemTheme}-theme error-input`
                            : `employeeblock-inputfields__label-choose choose-gender ${systemTheme}-theme`
                        }
                      >
                        <li
                          className={`choose-gender__item ${systemTheme}-theme`}
                        >
                          <input
                            onChange={(e) =>
                              handleChangesInputValues(
                                e.target.name,
                                e.target.value
                              )
                            }
                            id="gender-male"
                            className={`choose-gender__input ${systemTheme}-theme`}
                            type="radio"
                            value="male"
                            name="gender"
                            checked={changeValueData.gender === 'male'}
                          />
                          <label
                            className={`choose-gender__text ${systemTheme}-theme`}
                            htmlFor="gender-male"
                          >
                            Мужской
                          </label>
                          <div className="choose-gender__item-check"></div>
                        </li>
                        <li
                          className={`choose-gender__item ${systemTheme}-theme`}
                        >
                          <input
                            onChange={(e) =>
                              handleChangesInputValues(
                                e.target.name,
                                e.target.value
                              )
                            }
                            id="gender-female"
                            className={`choose-gender__input ${systemTheme}-theme`}
                            type="radio"
                            value="female"
                            checked={changeValueData.gender === 'female'}
                            name="gender"
                          />
                          <label
                            className={`choose-gender__text ${systemTheme}-theme`}
                            htmlFor="gender-female"
                          >
                            Женский
                          </label>
                          <div className="choose-gender__item-check"></div>
                        </li>
                      </ul>
                    </label>
                    <label className="employeeblock-inputfields__label workspace-label">
                      <span
                        className={`employeeblock-inputfields__text inputfields-text workspace-text ${systemTheme}-theme`}
                      >
                        ДОЛЖНОСТЬ
                      </span>
                      <input
                        onChange={(e) =>
                          handleChangesInputValues(
                            e.target.name,
                            e.target.value
                          )
                        }
                        className={
                          inputError.workposition
                            ? `employeeblock-inputfields__input inputfields-input workspace-input ${systemTheme}-theme error-input`
                            : `employeeblock-inputfields__input inputfields-input workspace-input ${systemTheme}-theme`
                        }
                        type="text"
                        name="workposition"
                        value={changeValueData.workposition}
                      />
                    </label>
                  </div>
                </div>
              )}
              {(cardSettings === 'news' || cardSettings === 'projects') && (
                <label className="admin-inputfields__label">
                  <span
                    className={`admin-inputfields__text inputfields-text title-text ${systemTheme}-theme`}
                  >
                    ЗАГОЛОВОК
                  </span>
                  <input
                    onChange={(e) =>
                      handleChangesInputValues(e.target.name, e.target.value)
                    }
                    className={
                      inputError.title
                        ? `admin-inputfields__input inputfields-input title-input ${systemTheme}-theme error-input`
                        : `admin-inputfields__input inputfields-input title-input ${systemTheme}-theme`
                    }
                    type="text"
                    name="title"
                    maxLength={39}
                    value={changeValueData.title}
                  />
                </label>
              )}
              <label className="admin-inputfields__label">
                <span
                  className={`admin-inputfields__text inputfields-text description-text ${systemTheme}-theme`}
                >
                  ОПИСАНИЕ
                </span>
                <textarea
                  onChange={(e) =>
                    handleChangesInputValues(e.target.name, e.target.value)
                  }
                  className={
                    inputError.description
                      ? `admin-inputfields__textarea description-textarea ${systemTheme}-theme error-input`
                      : `admin-inputfields__textarea description-textarea ${systemTheme}-theme`
                  }
                  type="text"
                  name="description"
                  value={changeValueData.description}
                />
              </label>

              {cardSettings === 'projects' && (
                <label className="admin-inputfields__label">
                  <span
                    className={`admin-inputfields__text inputfields-text companyfield-text ${systemTheme}-theme`}
                  >
                    НАЗВАНИЕ КОМПАНИИ
                  </span>
                  <input
                    onChange={(e) =>
                      handleChangesInputValues(e.target.name, e.target.value)
                    }
                    className={
                      inputError.company
                        ? `admin-inputfields__input inputfields-input companyfield-input ${systemTheme}-theme error-input`
                        : `admin-inputfields__input inputfields-input companyfield-input ${systemTheme}-theme`
                    }
                    type="text"
                    maxLength={25}
                    name="company"
                    value={changeValueData.company}
                  />
                </label>
              )}
            </div>
            <div className="adminpanel-cardform__wrapperbuttons">
              <button
                className={`adminpanel-cardform__wrapperbuttons-submitbtn btn-reset ${systemTheme}-theme`}
                type="submit"
              >
                {createChangeSettings ? 'СОЗДАТЬ' : 'ИЗМЕНИТЬ'}
              </button>
              <button
                onClick={() => {
                  resetAllInputFields()
                  if (document.getElementById('preview')) {
                    document.getElementById('preview').src = getPlaceholder(
                      cardType,
                      changeValueData.gender
                    )
                  }
                }}
                className={`adminpanel-cardform__wrapperbuttons-clearbtn btn-reset ${systemTheme}-theme`}
                type="button"
              >
                ОЧИСТИТЬ
              </button>
            </div>
          </form>
          <div className="adminpanel-cardform__closebtnwrap wrapbutton-close-theme">
            <button
              onClick={handleBtnCloseModalWindow}
              className={`adminpanel-cardform__btn button-close-theme btn-reset ${systemTheme}-theme`}
            ></button>
          </div>
        </div>
      </div>
    </div>
  )
}

const getPlaceholder = (cardType, gender, image) => {
  if (image) {
    return image
  }
  if (cardType === 'news') {
    return `/assets/images/other/placeholder.jpg`
  }

  if (cardType === 'employees') {
    if (gender === 'female') {
      return '/assets/aboutus/person-woman.jpg'
    } else {
      return '/assets/aboutus/person-man.jpg'
    }
  }

  if (cardType === 'projects') {
    return '/assets/images/other/placeholder.jpg'
  }
}

export default ModalWindowCreateChangeCard
