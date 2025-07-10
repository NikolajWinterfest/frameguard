import { addData, deleteData, updateData } from '../api/api'
import { INIT_DATA, ADD_CARD, UPDATE_CARD, DELETE_CARD } from './actionTypes'
import { serverData } from '../api/api'

//__________________________________________________ CREATE «Actions» __________________________________________________//

// CARD Actions
const addCard = (cardType, card) => async (dispatch) => {
  try {
    const { imageUrl } = await addData(cardType, card)

    let transform_card = transformData(card, imageUrl)
 
    dispatch({ type: ADD_CARD, cardType, payload: transform_card })
  } catch (error) {
    console.log('Error adding card: ', error)
  }
}

const transformData = (card, imageUrl) => {
  const obj = {}

  for (let key in card) {
    if (key === 'oldImage') {
      continue
    }
    if (key !== 'image')
    {
      obj[key] = card[key]
      continue
    }    
  }

  if (imageUrl) {
    obj['image'] = imageUrl
  }
  else if (card.oldImage) {
    obj['image'] = card.oldImage          
  }
  else {
    obj['image'] = ""
  }

  return obj
}

const updateCard = (cardType, card) => async (dispatch) => {
  try {

    const { imageUrl } = await updateData(cardType, card.id, card)
 


    let transform_card = transformData(card, imageUrl);

 


    dispatch({ type: UPDATE_CARD, cardType, payload: transform_card })
  } catch (error) {
    console.log('Error updating card: ', error)
  }
}

const deleteCard = (cardType, id) => async (dispatch) => {
  try {
    await deleteData(cardType, id)

    dispatch({ type: DELETE_CARD, cardType, payload: id })
  } catch (error) {
    console.log('Error deleting card: ', error)
  }
}

const initData = () => async (dispatch) => {
  try {
    const [news, employees, projects] = await Promise.all([
      serverData('news'),
      serverData('employees'),
      serverData('projects'),
    ])
    dispatch({
      type: INIT_DATA,
      payload: { news, employees, projects },
    })
  } catch (error) {
    console.log('Error initializing data: ', error)
  }
}

export { initData, addCard, updateCard, deleteCard }
