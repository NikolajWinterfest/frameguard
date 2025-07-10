import { INIT_DATA, ADD_CARD, UPDATE_CARD, DELETE_CARD } from './actionTypes'
// import ourNews from '../data/news.json'
// import ourProjects from '../data/projects.json'
// import ourEmployees from '../data/employees.json'

//__________________________________________________ INITIAL STATE'S OF JSON FILES __________________________________________________//
// GET Array of «News», «Employees», «Projects» and CREATE «Initial State» for them
const initialState = {
  news: [],
  employees: [],
  projects: [],
}

//__________________________________________________ REDUCER'S __________________________________________________//

// CARD Reducer
const cardsReducer = (state = initialState, action) => {
  const { type, cardType, payload } = action

  switch (type) {
    case INIT_DATA:
      return {
        ...state,
        news: payload.news,
        employees: payload.employees,
        projects: payload.projects,
      }
    case ADD_CARD:
      return {
        ...state,
        [cardType]: [...state[cardType], payload],
      }
    case UPDATE_CARD:
      return {
        ...state,
        [cardType]: state[cardType].map((card) =>
          card.id === payload.id ? payload : card
        ),
      }
    case DELETE_CARD:
      return {
        ...state,
        [cardType]: state[cardType].filter((card) => card.id !== payload),
      }
    default:
      return state
  }
}

export default cardsReducer
