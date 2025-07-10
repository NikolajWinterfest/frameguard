import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { SiYoutube } from 'react-icons/si'
import { SiTelegram } from 'react-icons/si'
import { SlSocialVkontakte } from 'react-icons/sl'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import SERVER_URL from '../api/config'
import { useTheme } from '../context/ThemeContext'
import validationContactsForm from '../utils/validationContactsForm'
import SendFormModalWindow from './reuseable/SendFormModalWindow'
import SpecialOffer from './specialoffer/SpecialOffer'

const Contacts = () => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  // useRef // Changing input field of «textarea»
  const contactsSectionRef = useRef(null)

  //__________________________________________________ HOOKS «useState's» __________________________________________________//
  // useState // Values for Input Fields
  const [fieldValues, setFieldValues] = useState({
    id: '',
    name: '',
    email: '',
    textarea: '',
    phone: '',
    date: '',
  })

  // useState // Count of attached files
  const [countAttachedFiles, setCountAttachedFiles] = useState(null)

  // useState // Attached files
  const [attachedFiles, setAttachedFiles] = useState(null)

  // useState // Button «Clear» if Input Fields have Text «Show (true)», «Hidden (false)»
  const [btnClear, setBtnClear] = useState(false)

  // useState // Value of Input «Agreement to the Privacy Policy»
  const [confirmAgreementValue, setConfirmAgreementValue] = useState(false)

  // useState // «Text Error» if Input Fields don't have value
  const [textError, setTextError] = useState({
    name: false,
    email: false,
    textarea: false,
    phone: false,
    privacypolicy: false,
  })

  // useState // Active mode for «Send Form Modal window»
  const [sendFormModalWindow, setSendFormModalWindow] = useState(false)

  // useState // Data so that the user can view it in «Modal Window»
  const [modalWindowData, setModalWindowData] = useState({
    name: '',
    email: '',
    textarea: '',
    phone: '',
    files: '',
  })

  //__________________________________________________ HOOKS «useCallback» and «useEffect» __________________________________________________//
  // EVENT HANDLER //
  const scrollToContacts = () => {
    if (contactsSectionRef.current) {
      contactsSectionRef.current.scrollIntoView({ behavior: 'smooth' })
      setFieldValues((prevValues) => ({
        ...prevValues,
        textarea: 'Хочу попробовать демо!',
      }))
    }
  }

  // EVENT HANDLER // Show Count of files in Frame of Input Field
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setAttachedFiles(e.target.files)
      setCountAttachedFiles(e.target.files.length)
    } else {
      setAttachedFiles(e.target.files)
      setCountAttachedFiles(null)
    }
  }

  // EVENT HANDLER // Monitoring Сhanges in Input Fields
  const handleInputChangeValue = (inputField, name) => {
    setFieldValues({
      ...fieldValues,
      id: uuidv4(),
      date: new Date().toISOString(),
      [name]: inputField.target.value,
    })
  }

  // EVENT HANDLER // Button to Clear all Input Fields
  const handleBtnClear = (e) => {
    e.preventDefault()

    setFieldValues({
      id: '',
      name: '',
      email: '',
      phone: '',
      textarea: '',
      date: '',
    })
    setCountAttachedFiles(null)
    setAttachedFiles(null)
    setTextError({
      name: false,
      email: false,
      textarea: false,
      phone: false,
      privacypolicy: false,
    })
    setConfirmAgreementValue(false)
    setBtnClear(false)
  }

  // useEffect // Show Button «Clear» if Input Fields have Text
  useEffect(() => {
    const isAnyFieldFilled = Object.values(fieldValues).some(
      (value) =>
        value.trim() !== '' ||
        countAttachedFiles > 0 ||
        Object.values(textError).some((error) => error) ||
        confirmAgreementValue
    )
    setBtnClear(isAnyFieldFilled)
  }, [textError, confirmAgreementValue, fieldValues, countAttachedFiles])

  // EVENT HANDLER // Watching for Changes in Input «Agreement to the Privacy Policy»
  const handleCheckboxPrivacyPolicy = () => {
    setConfirmAgreementValue(!confirmAgreementValue)
  }

  // useEffect // Watching for State Changes «Privacy Policy»
  useEffect(() => {
    if (confirmAgreementValue) {
      setTextError((prevTextError) => ({
        ...prevTextError,
        privacypolicy: false,
      }))
    }
  }, [confirmAgreementValue])

  // EVENT HANDLER // Sending Data of «Contacts Form» to the Server
  const handleSubmittedContactsForm = async (e) => {
    e.preventDefault()

    let hasValidationErrors = false // Show «Error message»

    // Get Text's for «Error message»
    const updatedErrors = {
      name: fieldValues.name === '',
      email: fieldValues.email === '',
      phone: fieldValues.phone === '',
      textarea: fieldValues.textarea === '',
      privacypolicy: !confirmAgreementValue,
    }

    setTextError(updatedErrors) // Update «Error message's»

    for (const [fieldName, fieldValue] of Object.entries(fieldValues)) {
      const errorMessage = validationContactsForm(fieldName, fieldValue)
      if (errorMessage) {
        hasValidationErrors = true

        setTextError((prevTextError) => ({
          ...prevTextError,
          [fieldName]: true, // Show «Error message»
        }))
      }
    }

    if (!confirmAgreementValue) {
      hasValidationErrors = true
      setTextError((prevTextError) => ({
        ...prevTextError,
        privacypolicy: true,
      }))
    }
    if (hasValidationErrors) {
      return
    }

    // Push Data to «SendForm Modal Window»
    setModalWindowData({
      name: fieldValues.name,
      email: fieldValues.email,
      phone: fieldValues.phone,
      textarea: fieldValues.textarea,
      files: countAttachedFiles,
    })

    setSendFormModalWindow(true) // Activation «SendForm Modal Window»

    // Creating formData and send this information to Server
    const formData = new FormData()

    formData.append('id', fieldValues.id)
    formData.append('name', fieldValues.name)
    formData.append('email', fieldValues.email)
    formData.append('phone', fieldValues.phone)
    formData.append('textarea', fieldValues.textarea)
    formData.append('countfiles', countAttachedFiles)
    formData.append('date', fieldValues.date)

    if (attachedFiles) {
      for (let i = 0; i < attachedFiles.length; i++)
        formData.append('files', attachedFiles[i])
    }

    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(`${SERVER_URL}/data/forms/`, formData, {
        'Content-Type': 'multipart/form-data',
      })
    } catch (error) {
      console.error('Ошибка отправки данных:', error)
    }

    document.body.classList.add('stop-scroll-pr') // Activation «Stop Scroll»

    handleBtnClear(e)
  }

  // useState // Special offer visibility (show after 10 seconds)
  const [showSpecialOffer, setShowSpecialOffer] = useState(false)

  // useEffect // Set a timeout to show Special Offer after 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpecialOffer(true)
    }, 5000)

    return () => clearTimeout(timer) // Cleanup timer on component unmount
  }, [])

  return (
    <>
      <SpecialOffer
        showSpecialOffer={showSpecialOffer}
        setShowSpecialOffer={setShowSpecialOffer}
        scrollToContacts={scrollToContacts}
      />

      <SendFormModalWindow
        sendFormModalWindow={sendFormModalWindow}
        setSendFormModalWindow={setSendFormModalWindow}
        modalWindowData={modalWindowData}
        setModalWindowData={setModalWindowData}
      />
      <section id="contacts" className="contacts" ref={contactsSectionRef}>
        <div className="contacts__wrapper container">
          <h2 className="contacts__title secondary-title">КОНТАКТЫ</h2>
          <p className="contacts__descr">
            Ждём ваших предложений по сотрудничеству
          </p>
          <div className="contacts__content contacts-content">
            <form
              onSubmit={(e) => handleSubmittedContactsForm(e)}
              className={`contacts-content__form contacts-form ${systemTheme}-theme`}
            >
              <div className="contacts-form__inputfields contacts-inputfields">
                <div className="contacts-inputfields__fieldsblock fieldsblock">
                  <div className="fieldsblock__fieldwrapper">
                    <div
                      className={
                        textError.name
                          ? 'fieldsblock__fieldwrapper-errortext error-message'
                          : 'fieldsblock__fieldwrapper-errortext'
                      }
                    >
                      {validationContactsForm('name', fieldValues.name)}
                    </div>
                    <input
                      onChange={(e) => handleInputChangeValue(e, 'name')}
                      className={`fieldsblock__fieldwrapper-input input-name ${systemTheme}-theme`}
                      value={fieldValues.name}
                      maxLength={50}
                      type="text"
                      placeholder="Введите ваше имя"
                    />
                  </div>
                  <div className="fieldsblock__fieldwrapper">
                    <div
                      className={
                        textError.email
                          ? 'fieldsblock__fieldwrapper-errortext error-message'
                          : 'fieldsblock__fieldwrapper-errortext'
                      }
                    >
                      {validationContactsForm('email', fieldValues.email)}
                    </div>
                    <input
                      onChange={(e) => handleInputChangeValue(e, 'email')}
                      className={`fieldsblock__fieldwrapper-input input-email ${systemTheme}-theme`}
                      value={fieldValues.email}
                      type="text"
                      placeholder="Введите ваш email"
                    />
                  </div>
                  <div className="fieldsblock__fieldwrapper">
                    <div
                      className={
                        textError.phone
                          ? 'fieldsblock__fieldwrapper-errortext error-message'
                          : 'fieldsblock__fieldwrapper-errortext'
                      }
                    >
                      {validationContactsForm('phone', fieldValues.phone)}
                    </div>
                    <input
                      onChange={(e) => handleInputChangeValue(e, 'phone')}
                      className={`fieldsblock__fieldwrapper-input input-phone ${systemTheme}-theme`}
                      value={fieldValues.phone}
                      type="tel"
                      placeholder="Введите ваш номер телефона (необязательно)"
                    />
                  </div>
                </div>
                <div className="contacts-inputfields__fieldblock-file fieldblock-file">
                  <div className="fieldblock-file__fieldwrapper wrapperarea">
                    <div
                      className={
                        textError.textarea
                          ? 'fieldsblock__fieldwrapper-errortext error-message'
                          : 'fieldsblock__fieldwrapper-errortext'
                      }
                    >
                      {validationContactsForm('textarea', fieldValues.textarea)}
                    </div>
                    <textarea
                      onChange={(e) => handleInputChangeValue(e, 'textarea')}
                      className={`wrapperarea__area input-area ${systemTheme}-theme`}
                      value={fieldValues.textarea}
                      placeholder="Опишите свой вопрос/предложение, можно оставить контактные данные социальных сетей"
                    />
                  </div>
                  <div
                    className={`fieldblock-file__fieldwrapper wrapperfiles ${systemTheme}-theme`}
                  >
                    <span className="wrapperfiles__text">Прикрепить файл</span>
                    <input
                      onChange={(e) => handleFileChange(e)}
                      className="wrapperfiles__file input-file"
                      type="file"
                      multiple
                      accept=".pdf, image/*"
                    />
                    <span className="wrapperfiles__filename">
                      {countAttachedFiles || 'Файл не выбран'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="contacts-form__send contacts-send">
                <div className="contacts-send__privacypolicy privacypolicywrap">
                  <div
                    className={
                      textError.privacypolicy
                        ? 'privacypolicywrap__errortext error-message'
                        : 'privacypolicywrap__errortext'
                    }
                  >
                    Пожалуйста, подтвердите политику конфиденциальности
                  </div>
                  <label
                    className="privacypolicywrap__label-checkbox"
                    htmlFor="privacypolicy-checkbox"
                  >
                    <input
                      onChange={handleCheckboxPrivacyPolicy}
                      id="privacypolicy-checkbox"
                      className="privacypolicywrap__input-checkbox"
                      type="checkbox"
                      checked={confirmAgreementValue}
                    />
                    <span
                      className={`privacypolicywrap__icon-checkbox ${systemTheme}-theme`}
                    ></span>
                    <span
                      className={`privacypolicywrap__agreement ${systemTheme}-theme`}
                    >
                      Даю согласие на&nbsp;обработку персональных данных
                    </span>
                  </label>
                  <Link
                    onClick={() => {
                      window.scrollTo({
                        top: 0,
                        behavior: 'smooth',
                      })
                    }}
                    className={`privacypolicywrap__link ${systemTheme}-theme`}
                    to="/privacypolicy"
                  >
                    Политика конфиденциальности
                  </Link>
                </div>
                <div className="contacts-send__btnwrap">
                  {btnClear && (
                    <button
                      onClick={handleBtnClear}
                      className={`contacts-send__btnwrap-clear ${systemTheme}-theme`}
                    >
                      ОЧИСТИТЬ
                    </button>
                  )}
                  <button
                    className={`contacts-send__btnwrap-send ${systemTheme}-theme`}
                    type="submit"
                  >
                    ОТПРАВИТЬ
                  </button>
                </div>
              </div>
              <div
                className={`contacts-form__companyname background-companyname ${systemTheme}-theme`}
              >
                FrameGuard
              </div>
              <div
                className={`contacts-form__companyname background-companyname ver-mobile ${systemTheme}-theme`}
              >
                FG
              </div>
            </form>
            <div className="contacts-content__location company-location">
              <div className="company-location__information">
                <div className="company-location__information-description information-description">
                  <div className="information-description__wrapper">
                    <div className="information-description__wrapper-feedback feedback">
                      <Link
                        className={`feedback__email ${systemTheme}-theme`}
                        to="mailto:frameguard@proton.me"
                      >
                        frameguard@proton.me
                      </Link>
                      <Link
                        className={`feedback__phone ${systemTheme}-theme`}
                        to="tel:+79023562063"
                      >
                        +7 902 356 20 63
                      </Link>
                    </div>
                    <div className="information-description__wrapper-socialnetworks socialnetworks">
                      <h4 className="socialnetworks__title tertiary-title">
                        СОЦИАЛЬНЫЕ СЕТИ
                      </h4>
                      <ul className="socialnetworks__list">
                        <li className="socialnetworks__item">
                          <Link
                            className={`socialnetworks__item-link ${systemTheme}-theme`}
                            to="https://vk.com/"
                            target="_blank"
                          >
                            <SlSocialVkontakte />
                          </Link>
                        </li>
                        <li className="socialnetworks__item">
                          <Link
                            className={`socialnetworks__item-link ${systemTheme}-theme`}
                            to="https://www.youtube.com/"
                            target="_blank"
                          >
                            <SiYoutube />
                          </Link>
                        </li>
                        <li className="socialnetworks__item">
                          <Link
                            className={`socialnetworks__item-link ${systemTheme}-theme`}
                            to="https://web.telegram.org/a/"
                            target="_blank"
                          >
                            <SiTelegram />
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="company-location__information-photowrapper photowrapper">
                  <img
                    className="photowrapper__image"
                    src="/assets/contacts/frameguard-workplaces.jpg"
                    alt="Фотография – Рабочие места"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contacts
