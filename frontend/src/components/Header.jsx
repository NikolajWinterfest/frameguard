import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BsSunFill, BsMoonFill } from 'react-icons/bs'
import { useTheme } from '../context/ThemeContext'
import { useSelector } from 'react-redux'
import SvgSpriteLogo from '../utils/SvgSpriteLogo'

const Header = () => {
  // CUSTOM THEME HOOK // Watching «Theme Color» Changes
  const { systemTheme, toggleTheme } = useTheme()

  //__________________________________________________ HOOKS useNavigate» and «useLocation» __________________________________________________//
  // useNavigate // Navigation for «Unique Pages»
  const navigate = useNavigate()

  // useLocation // Check Router Location
  const location = useLocation()

  //__________________________________________________ HOOKS «useState's» __________________________________________________//
  // useState // Class «is-active» for «Burger Menu»
  const [activeClass, setActiveClass] = useState(false)

  // useState // Link for «Smooth Scroll»
  const [targetSection, setTargetSection] = useState(null)

  //__________________________________________________ EVENT HANDLER'S and HOOKS «useEffect's» __________________________________________________//
  // EVENT HANDLER // Scroll to top Page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // EVENT HANDLER // Scroll to «Section»
  const scrollToSection = (link) => {
    link.scrollIntoView({ behavior: 'smooth' })
  }

  // useEffect // Watching for Changes on element «body»
  useEffect(() => {
    // EVENT HANDLER // «Stop scroll» for element «body»
    const handleStopScroll = () => {
      if (activeClass) {
        document.body.classList.add('stop-scroll')
      } else {
        document.body.classList.remove('stop-scroll')
      }
    }

    handleStopScroll()
  }, [activeClass])

  // useEffect // Watching for Changes on Link's in «Burger Menu»
  useEffect(() => {
    // Check Location and go to RouterLink «/» or section «#» on Home Page
    if (location.pathname === '/' && targetSection) {
      const targetElement = document.getElementById(targetSection)

      if (targetElement) {
        scrollToSection(targetElement)
      }

      setTargetSection(null)
    }
  }, [location, targetSection])

  // EVENT HANDLER // «Burger Menu» and «Navigation» for Link's
  const handleBurgerMenu = (e, linkHref) => {
    e.preventDefault()

    if (linkHref && linkHref.startsWith('#')) {
      const targetId = linkHref.substring(1)
      if (location.pathname !== '/') {
        setTargetSection(targetId)
        navigate('/')
      } else {
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          scrollToSection(targetElement)
        }
      }
    } else if (linkHref) {
      scrollToTop()
      navigate(linkHref)
      setActiveClass(!activeClass)
    } else {
      setActiveClass(!activeClass)
    }

    setActiveClass(!activeClass)
  }

  // Admin Panel Router // If isAuthenticated = true, You can visit «Admin Panel»
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)

  return (
    <header className={`header ${systemTheme}-theme`}>
      <div className="header__wrapper container">
        <nav className="header__nav nav-menu">
          <button
            onClick={scrollToTop}
            className={`nav-menu__logo btn-reset ${systemTheme}-theme`}
          >
            {true ? (
              <div className={`nav-menu__logo-icon ${systemTheme}-theme`}>
                <SvgSpriteLogo />
              </div>
            ) : (
              <div className={`nav-menu__logo-icon ${systemTheme}-theme`}>
                FG
              </div>
            )}
          </button>
          <div
            className={
              activeClass
                ? `nav-menu__isolated-background isolated-background is-active ${systemTheme}-theme`
                : `nav-menu__isolated-background isolated-background ${systemTheme}-theme`
            }
          >
            <ul
              className={
                activeClass
                  ? 'isolated-background__list is-active'
                  : 'isolated-background__list'
              }
            >
              <li className="isolated-background__item">
                <Link
                  to="/"
                  onClick={(e) => handleBurgerMenu(e, '/')}
                  className={`isolated-background__item-link ${systemTheme}-theme`}
                >
                  ГЛАВНАЯ СТРАНИЦА
                </Link>
              </li>
              <li className="isolated-background__item">
                <a
                  href="#aboutus"
                  onClick={(e) => handleBurgerMenu(e, '#aboutus')}
                  className={`isolated-background__item-link ${systemTheme}-theme`}
                >
                  О&nbsp;КОМПАНИИ
                </a>
              </li>
              <li className="isolated-background__item">
                <a
                  href="#projects"
                  onClick={(e) => handleBurgerMenu(e, '#projects')}
                  className={`isolated-background__item-link ${systemTheme}-theme`}
                >
                  ПРОЕКТЫ
                </a>
              </li>
              <li className="isolated-background__item">
                <a
                  href="#contacts"
                  onClick={(e) => handleBurgerMenu(e, '#contacts')}
                  className={`isolated-background__item-link ${systemTheme}-theme`}
                >
                  КОНТАКТЫ
                </a>
              </li>
              <li className="isolated-background__item">
                <Link
                  to="privacypolicy"
                  onClick={(e) => handleBurgerMenu(e, '/privacypolicy')}
                  className={`isolated-background__item-link ${systemTheme}-theme`}
                >
                  ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ
                </Link>
              </li>
              {isAuthenticated && (
                <li className="isolated-background__item">
                  <Link
                    to="adminpanel"
                    onClick={(e) => handleBurgerMenu(e, '/adminpanel')}
                    className={`isolated-background__item-link ${systemTheme}-theme`}
                  >
                    АДМИНИСТРАТИВНАЯ ПАНЕЛЬ
                  </Link>
                </li>
              )}
            </ul>
          </div>
          <div
            className={`nav-menu__theme-mode theme-mode ${systemTheme}-theme`}
          >
            <button
              onClick={toggleTheme}
              className={
                systemTheme === 'day'
                  ? `theme-mode__day btn-reset active-mode ${systemTheme}-theme`
                  : `theme-mode__day btn-reset ${systemTheme}-theme`
              }
            >
              <BsSunFill />
            </button>
            <button
              onClick={toggleTheme}
              className={
                systemTheme === 'night'
                  ? `theme-mode__night btn-reset active-mode ${systemTheme}-theme`
                  : `theme-mode__night btn-reset ${systemTheme}-theme`
              }
            >
              <BsMoonFill />
            </button>
          </div>
          <div className="nav-menu__burger burger">
            <button
              onClick={handleBurgerMenu}
              className={
                activeClass
                  ? `burger__button btn-reset is-active ${systemTheme}-theme`
                  : `burger__button btn-reset ${systemTheme}-theme`
              }
            ></button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
