import { createContext, useState, useContext, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  // Class of Theme (day/night)
  const [systemTheme, setSystemTheme] = useState(() => {
    return localStorage.getItem('systemTheme') || 'night'
  })

  // Toggle for Theme Swtich Button (day/night)
  const toggleTheme = () => {
    setSystemTheme((prevTheme) => (prevTheme === 'night' ? 'day' : 'night'))
  }

  useEffect(() => {
    localStorage.setItem('systemTheme', systemTheme) // Saving Theme

    if (systemTheme === 'night') {
      document.body.classList.remove('day-theme')
      document.body.classList.add('night-theme')
    } else {
      document.body.classList.remove('night-theme')
      document.body.classList.add('day-theme')
    }
  }, [systemTheme])

  return (
    <ThemeContext.Provider value={{ systemTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
