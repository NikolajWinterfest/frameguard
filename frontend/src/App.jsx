import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useDispatch, Provider } from 'react-redux'
import { useEffect } from 'react'
import { initData } from './redux/actions'
import store from './redux/store'

// Import JSX Components //
import Home from './pages/Home' // Unique Page
import NotFound from './pages/NotFound'
import Admin from './pages/Admin' // Unique Page
import AdminPanel from './pages/AdminPanel' // Unique Page
import MainLayout from './layouts/MainLayout'
import PrivacyPolicy from './pages/PrivacyPolicy' // Unique Page
import NotFoundLayout from './layouts/NotFoundLayout'
import { ThemeProvider } from './context/ThemeContext' // Theme Selection Provider
import PrivateRoute from './components/PrivateRoute'

// Import «CSS Files» for Components //
// App «HEAD CSS File»
import './App.css'
// Home (Unique Page) «CSS»
import './pages/Home.css'
// Header «CSS»
import './components/Header.css'
// Hero Section «CSS»
import './components/HeroSection.css'
// Todo Section «CSS»
import './components/TodoSection.css'
// News Section «CSS»
import './components/NewsSection.css'
import './components/reuseable/NewsCardWindow.css'
// Special Offer Section «CSS»
import './components/specialoffer/SpecialOffer.css'
// Watch Video «CSS»
import './components/WatchVideoSection.css'
// AboutUs Section «CSS»
import './components/AboutUsSection.css'
import './components/reuseable/EmployeeCardWindow.css'
import './components/reuseable/TemporaryPhotoStub.css'
// Projects Section «CSS»
import './components/ProjectsSection.css'
import './components/reuseable/ProjectCardWindow.css'
// Contacts Section «CSS»
import './components/ContactsSection.css'
import './components/reuseable/SendFormModalWindow.css'
// Privacy Policy (Unique Page) «CSS»
import './pages/PrivacyPolicy.css'
import './components/reuseable/ListOfRulesPrivacyPolicy.css'
// Not Found Page (Unique Page) «CSS»
import './pages/NotFound.css'
// Admin (Unique Page) «CSS»
import './pages/Admin.css'
// Admin Panel (Unique Page) «CSS»
import './pages/AdminPanel.css'
import './components/adminpanel/reuseable/ModalWindowCreateChangeCard.css'
import './components/adminpanel/reuseable/DeleteCardModalWindow.css'
import './components/adminpanel/reuseable/FormModalWindow.css'
import './components/adminpanel/AdminPanelCard.css'
import './components/adminpanel/AdminPanelForm.css'
// Footer «CSS»
import './components/Footer.css'
// Breakpoints «CSS»
import './css/breakpoints/width1497px.css'
import './css/breakpoints/width992px.css'
import './css/breakpoints/width576px.css'
import AdminLayout from './layouts/AdminLayout'

function AppContent() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initData())
  }, [dispatch])

  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="privacypolicy" element={<PrivacyPolicy />} />
        <Route
          path="adminpanel"
          element={
            <PrivateRoute>
              <AdminPanel />
            </PrivateRoute>
          }
        />
      </Route>
      <Route path="*" element={<NotFoundLayout />}>
        <Route index element={<NotFound />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Admin />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <div className="App">
            <AppContent />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  )
}

export default App
