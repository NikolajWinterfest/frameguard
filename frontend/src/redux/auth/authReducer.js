const initialState = {
  isAuthenticated: localStorage.getItem('isAuthenticated') === 'true',
  user: JSON.parse(localStorage.getItem('user')),
  error: null,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.username,
        token: action.payload.token,
        error: null,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload,
      }
    case 'LOGOUT':
      return { ...state, isAuthenticated: false, user: null, error: null, token: null }
    case 'CLEAR_AUTH_ERROR':
      return { ...state, error: null, token: null }
    default:
      return state
  }
}

export default authReducer
