import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authReducer'
import cardsReducer from '../redux/reducer'

const store = configureStore({
  reducer: {
    auth: authReducer,
    cards: cardsReducer,
  },
})

export default store
