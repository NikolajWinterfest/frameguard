import axios from '../../customAxios'

export const login = (username, password) => {
  return async (dispatch) => {
    try {
      const { data } = await axios.post('/admin', {
        username: username,
        password: password,
      })

      if (!data) {
        alert('Не удалось авторизоваться!')
        return dispatch({
          type: 'LOGIN_FAILURE',
          payload: 'Неверный логин или пароль',
        })
      }

      if ('token' in data) {
        localStorage.setItem('token', data.token)
        //dispatch({ type: 'LOGIN_SUCCESS', payload: { user: data } })
        localStorage.setItem('isAuthenticated', 'true')
        localStorage.setItem('user', JSON.stringify(data))
        return dispatch({ type: 'LOGIN_SUCCESS', payload: data })
      } else {
        alert('Не удалось авторизоваться!')
        return dispatch({
          type: 'LOGIN_FAILURE',
          payload: 'Неверный логин или пароль',
        })
      }
    } catch (error) {
      return dispatch({
        type: 'LOGIN_FAILURE',
        payload: 'Неверный логин или пароль',
      })
    }
  }
}

export const logout = () => {
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('user')
  localStorage.removeItem('token')
  return { type: 'LOGOUT' }
}
