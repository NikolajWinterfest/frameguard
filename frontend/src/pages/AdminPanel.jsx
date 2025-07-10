import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RiLogoutBoxRLine } from 'react-icons/ri'
import { addCard, updateCard, deleteCard } from '../redux/actions'
import { logout } from '../redux/auth/authAction'
import { useTheme } from '../context/ThemeContext'
import AdminPanelCard from '../components/adminpanel/AdminPanelCard'
import ModalWindowCreateChangeCard from '../components/adminpanel/reuseable/ModalWindowCreateChangeCard'
import DeleteCardModalWindow from '../components/adminpanel/reuseable/DeleteCardModalWindow'
import AdminPanelForm from '../components/adminpanel/AdminPanelForm'
import FormModalWindow from '../components/adminpanel/reuseable/FormModalWindow'
import customAxios from '../customAxios'


const AdminPanel = () => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme } = useTheme()

  //__________________________________________________ HOOKS «useState's» __________________________________________________//
  // useState // Active Card «news». There are also meanings «employees», «projects»
  const [cardType, setCardType] = useState('news')

  // useState //
  const [dataForms, setDataForms] = useState([])
  const [showDataForm, setShowDataForm] = useState('')

  // useState // Active mode for «Modal window» Create/Change Card
  const [windowIsActiveCreateChange, setWindowIsActiveCreateChange] =
    useState(false)

  // useState // Active mode for «Modal window» Delete Card
  const [windowIsActiveDelete, setWindowIsActiveDelete] = useState(false)

  // useState // Active mode for «Modal window» Form Card
  const [windowIsActiveForm, setWindowIsActiveForm] = useState(false)

  // useState // Data Values for «Input Fields»
  const [changeValueData, setChangeValueData] = useState({
    id: '',
    name: '',
    surname: '',
    experience: '',
    workposition: '',
    gender: '',
    title: '',
    description: '',
    image: '',
    company: '',
  })

  // useState // Active mode for «Menu list»
  const [activeMenuList, setActiveMenuList] = useState({
    news: true,
    employees: false,
    projects: false,
    forms: false,
  })

  // useState // Show Card in Modal Window «true = CREATE Card», «false = CHANGE Card»
  const [createChangeSettings, setCreateChangeSettings] = useState(true)

  // useState // Card Settings «News», «Employees», «Projects»
  const [cardSettings, setCardSettings] = useState('')

  // useState //
  const [selectedFile, setSelectedFile] = useState(null)

  // useState //
  const [removeCardData, setRemoveCardData] = useState({
    cardType: '',
    id: '',
  })

  //__________________________________________________ EVENT HANDLER'S __________________________________________________//
  // EVENT HANDLER // Show List of Cards «news», «Employees», «Projects»
  const handleShowMenuList = (buttonList) => {
    if (buttonList === 'news') {
      setActiveMenuList({
        news: true,
        employees: false,
        projects: false,
        forms: false,
      })
      setCardType('news')
    }

    if (buttonList === 'employees') {
      setActiveMenuList({
        news: false,
        employees: true,
        projects: false,
        forms: false,
      })
      setCardType('employees')
    }

    if (buttonList === 'projects') {
      setActiveMenuList({
        news: false,
        employees: false,
        projects: true,
        forms: false,
      })
      setCardType('projects')
    }

    if (buttonList === 'forms') {
      setActiveMenuList({
        news: false,
        employees: false,
        projects: false,
        forms: true,
      })
      setCardType('forms')
    }
  }

  // EVENT HANDLER // Show Modal Window with Settings «CREATE CARD»
  const modalWindowBtnCreateCard = (typeOfCard) => {
    setWindowIsActiveCreateChange(true)
    setCreateChangeSettings(true)

    document.body.classList.add('stop-scroll-pr') // Activation «Stop Scroll»

    // Determine the types of cards
    if (typeOfCard === 'news') setCardSettings('news')
    if (typeOfCard === 'employees') setCardSettings('employees')
    if (typeOfCard === 'projects') setCardSettings('projects')
  }

  // EVENT HANDLER // Show Modal Window with Settings «CHANGE CARD»
  const modalWindowBtnChangeCard = (typeOfCard, card) => {
    setWindowIsActiveCreateChange(true)
    setCreateChangeSettings(false)

    document.body.classList.add('stop-scroll-pr') // Activation «Stop Scroll»

    // Determine the types of cards
    if (typeOfCard === 'news') setCardSettings('news')
    if (typeOfCard === 'employees') setCardSettings('employees')
    if (typeOfCard === 'projects') setCardSettings('projects')

    setChangeValueData({
      id: card.id,
      name: card.name,
      surname: card.surname,
      experience: card.experience,
      workposition: card.workposition,
      gender: card.gender,
      title: card.title,
      description: card.description,
      company: card.company,
      image: card.image || '',
      creationDate: card.creationDate,
    })
  }

  // EVENT HANDLER // Watching for Changes in input's
  const handleChangesInputValues = (name, value) => {
    return setChangeValueData((prevData) => ({ ...prevData, [name]: value }))
  }

  // EVENT HANDLER // Handle File Change
  const handleFileChange = (name, file) => { 
    
   
   
    if (file) {    
       setSelectedFile(file)
      setChangeValueData((prevData) => ({ ...prevData, [name]: file }))  
      const fullFileUrl = getFileUrl(file);
      return fullFileUrl
    }    
    else {
      return null;
    }
  }

  const getFileUrl = file => new Promise((resolve, reject) => {

   const reader = new FileReader();
   
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => {
      console.log(error);
      reject(null)
    };
  });

  // EVENT HANDLER // Handle Button «Reset» all input fields
  const resetAllInputFields = () => {
    setChangeValueData({
      ...changeValueData,
      name: '',
      surname: '',
      experience: '',
      workposition: '',
      gender: '',
      title: '',
      description: '',
      company: '',
      image: '',
    })
    setSelectedFile(null)
  }

  // EVENT HANDLER // Handle Button «LogOut»
  const handleLogout = (e) => {
    e.preventDefault()

    dispatch(logout())
  }

  // useEffect // GET Form Data
  useEffect(() => {
    const fetchData = async () => {
      const result = await customAxios.get(`/data/forms`)
      setDataForms(result.data)
    }

    fetchData()
  }, [])

  // EVENT HANDLER // Deleting «Form Card»
  const handleDeleteForm = async (id) => {
    await customAxios.delete(`/data/forms/${id}`)
    setDataForms(dataForms.filter((item) => item.id !== id))
  }
  //__________________________________________________ REDUX __________________________________________________//
  // REDUX // Creating REDUX HOOK «useDispatch»
  const dispatch = useDispatch()

  // REDUX STORE // Get Data Array (news, employees, projects) from «Store» with REDUX HOOK «useSelector»
  const news = useSelector((state) => state.cards.news)
  const employees = useSelector((state) => state.cards.employees)
  const projects = useSelector((state) => state.cards.projects)

  // REDUX STORE // Creation «Card»
  const handleAddCard = (cardType, card) => {
    const newCard = { ...card } // Create «New Card» for Array of («news» / «employees» / «projects») Cards
    dispatch(addCard(cardType, newCard))
    resetAllInputFields()
  }

  // REDUX STORE // Modify «Card»
  const handleUpdateCard = (cardType, card) => {
    const modifyCard = { ...card, id: card.id } // Update «Old Card» for Array of («news» / «employees» / «projects») Cards
    dispatch(updateCard(cardType, modifyCard))
    resetAllInputFields()
  }

  // REDUX STORE // Deletion «Card»
  const handleDeleteCard = (cardType, id) => {
    dispatch(deleteCard(cardType, id)) // Delete «Old Card» from Array of («news» / «employees» / «projects») Cards
  }

  return (
    <main className="main">
      <ModalWindowCreateChangeCard
        cardType={cardType} // Type card «news» or «employees», «projects»
        windowIsActiveCreateChange={windowIsActiveCreateChange} // Modal Window State «true», «false»
        setWindowIsActiveCreateChange={setWindowIsActiveCreateChange} // Modal Window Change State
        createChangeSettings={createChangeSettings} // Boolean «Create (true) / Change (false)»
        handleChangesInputValues={handleChangesInputValues} // Watching for Changes in Inputs
        resetAllInputFields={resetAllInputFields} // Clear all input fields in Card
        changeValueData={changeValueData} // Data Value of Input Fields
        cardSettings={cardSettings} // Card Seetings for «News», «Employees» and «Projects»
        handleAddCard={handleAddCard} // Add Card in REDUX STORE
        handleUpdateCard={handleUpdateCard} // Change Card in REDUX STORE
        handleFileChange={handleFileChange} // Wathcing for «Image» Changes
        selectedFile={selectedFile}
        setSelectedFile={setSelectedFile}
      />
      <DeleteCardModalWindow
        windowIsActiveDelete={windowIsActiveDelete} // «Small Modal Window (Do you want to delete Card?)» State «true», «false»
        setWindowIsActiveDelete={setWindowIsActiveDelete} // «Small Modal Window (Do you want to delete Card?)» Change State
        removeCardData={removeCardData} // Data «Remove Card»
        handleDeleteCard={handleDeleteCard} // Delete «News, Employee, Project» Card from REDUX STORE
        handleDeleteForm={handleDeleteForm} // Delete «Form» Card»
      />
      <FormModalWindow
        windowIsActiveForm={windowIsActiveForm} // «Form Modal Window» State «true», «false»
        setWindowIsActiveForm={setWindowIsActiveForm} // «Form Modal Window» Change State
        showDataForm={showDataForm} // Show «Form Data»
      />
      <section className="adminpanel">
        <div className="adminpanel__wrapper">
          <div className="adminpanel__wrappertitle">
            <h2 className="adminpanel__wrappertitle-title secondary-title">
              АДМИНИСТРАТИВНАЯ ПАНЕЛЬ
            </h2>
            <button
              onClick={handleLogout}
              className={`adminpanel__wrappertitle-logout btn-reset ${systemTheme}-theme`}
            >
              <RiLogoutBoxRLine />
            </button>
          </div>
          <div className="adminpanel__content">
            <ul className={`adminpanel__menu menu-list ${systemTheme}-theme`}>
              <li className="menu-list__item">
                <button
                  onClick={() => handleShowMenuList('news')}
                  className={
                    activeMenuList.news
                      ? `menu-list__item-btn btn-reset ${systemTheme}-theme is-active`
                      : `menu-list__item-btn btn-reset ${systemTheme}-theme`
                  }
                >
                  ЛЕНТА
                </button>
              </li>
              <li className="menu-list__item">
                <button
                  onClick={() => handleShowMenuList('employees')}
                  className={
                    activeMenuList.employees
                      ? `menu-list__item-btn btn-reset ${systemTheme}-theme is-active`
                      : `menu-list__item-btn btn-reset ${systemTheme}-theme`
                  }
                >
                  СОТРУДНИКИ
                </button>
              </li>
              <li className="menu-list__item">
                <button
                  onClick={() => handleShowMenuList('projects')}
                  className={
                    activeMenuList.projects
                      ? `menu-list__item-btn btn-reset ${systemTheme}-theme is-active`
                      : `menu-list__item-btn btn-reset ${systemTheme}-theme`
                  }
                >
                  ПРОЕКТЫ
                </button>
              </li>
              <li className="menu-list__item">
                <button
                  onClick={() => handleShowMenuList('forms')}
                  className={
                    activeMenuList.forms
                      ? `menu-list__item-btn btn-reset ${systemTheme}-theme is-active`
                      : `menu-list__item-btn btn-reset ${systemTheme}-theme`
                  }
                >
                  ФОРМЫ
                </button>
              </li>
            </ul>
            <div className="adminpanel__datalist adminpanel-datalist">
              {activeMenuList.news && (
                <AdminPanelCard
                  cards={news} // Array of «News» Data
                  cardType={cardType} // Type card «news»
                  modalWindowBtnCreateCard={modalWindowBtnCreateCard} // Modal window «CREATE CARD»
                  modalWindowBtnChangeCard={modalWindowBtnChangeCard} // Modal window «CHANGE CARD»
                  setWindowIsActiveDelete={setWindowIsActiveDelete} // «Small Modal Window (Do you want to delete Card?)» Change State
                  setRemoveCardData={setRemoveCardData} // Change State «Remove Card»
                />
              )}
              {activeMenuList.employees && (
                <AdminPanelCard
                  cards={employees} // Array of «Employees» Data
                  cardType={cardType} // Type card «employees»
                  modalWindowBtnCreateCard={modalWindowBtnCreateCard} // Modal window «CREATE CARD»
                  modalWindowBtnChangeCard={modalWindowBtnChangeCard} // Modal window «CHANGE CARD»
                  setWindowIsActiveDelete={setWindowIsActiveDelete} // «Small Modal Window (Do you want to delete Card?)» Change State
                  setRemoveCardData={setRemoveCardData} // Change State «Remove Card»
                />
              )}
              {activeMenuList.projects && (
                <AdminPanelCard
                  cards={projects} // Array of «Projects» Data
                  cardType={cardType} // Type card «projects»
                  modalWindowBtnCreateCard={modalWindowBtnCreateCard} // Modal Window «CREATE CARD»
                  modalWindowBtnChangeCard={modalWindowBtnChangeCard} // Modal Window «CHANGE CARD»
                  setWindowIsActiveDelete={setWindowIsActiveDelete} // «Small Modal Window (Do you want to delete Card?)» Change State
                  setRemoveCardData={setRemoveCardData} // Change State «Remove Card»
                />
              )}
              {activeMenuList.forms && (
                <AdminPanelForm
                  dataForms={dataForms} // Array of «Forms» Data
                  cardType={cardType} // Type card «forms»
                  setWindowIsActiveForm={setWindowIsActiveForm} // Modal Window State «Show Info»
                  setShowDataForm={setShowDataForm} // Change Data Form for viewing in «Modal Window»
                  setWindowIsActiveDelete={setWindowIsActiveDelete} // «Small Modal Window (Do you want to delete Card?)» Change State
                  setRemoveCardData={setRemoveCardData} // Change State «Remove Card»
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default AdminPanel
