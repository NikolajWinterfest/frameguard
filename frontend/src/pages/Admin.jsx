import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../redux/auth/authAction'

const Admin = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated)
  const authError = useSelector((state) => state.auth.error)

  const handleLogin = (e) => {
    e.preventDefault()

    dispatch(login(username, password))
  }

  const handleClear = () => {
    setUsername('')
    setPassword('')
    setErrorMessage('')
    dispatch({ type: 'CLEAR_AUTH_ERROR' })
  }

  useEffect(() => {
    if (authError) {
      setErrorMessage(authError)
    } else {
      setErrorMessage('')
    }
  }, [authError])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/adminpanel')
    }
  }, [isAuthenticated, navigate])

  return (
    <main className="main">
      <div className="admin">
        <div className="admin__wrapper">
          {!isAuthenticated && (
            <>
              <div className="admin__titlewrap">
                <h2 className="admin__title">АВТОРИЗАЦИЯ</h2>
                <div
                  className={
                    errorMessage
                      ? 'admin__errormessage is-active'
                      : 'admin__errormessage'
                  }
                >
                  {errorMessage}
                </div>
              </div>
              <form className="admin__form form-admin" onSubmit={handleLogin}>
                <div className="form-admin__authorization authorization">
                  <label className="authorization__label">
                    <span className="authorization__label-text">Логин</span>
                    <input
                      className="authorization__label-input admin-input-login"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </label>
                  <label className="authorization__label">
                    <span className="authorization__label-text">Пароль</span>
                    <input
                      className="authorization__label-input admin-input-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </label>
                </div>
                <div className="form-admin__wrapperbuttons wrapperbuttons">
                  <button
                    className="wrapperbuttons__btn-send btn-reset"
                    type="submit"
                  >
                    Войти
                  </button>
                  <button
                    className="wrapperbuttons__btn-clear btn-reset"
                    type="button"
                    onClick={handleClear}
                  >
                    Очистить
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

export default Admin
