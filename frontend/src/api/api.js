import customAxios from '../customAxios'

// GETTING // Server Data
const serverData = async (endpoint) => {
  try {
    const response = await customAxios.get(`/data/cards/${endpoint}`)

    return response.data
  } catch (error) {
    console.log('Error get data: ', error)
    throw error
  }
}

// ADDING //
const addData = async (endpoint, data) => {
  try {
    const response = await customAxios.post(`/data/cards/${endpoint}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    console.log('Error adding data: ', error)

    throw error
  }
}

// UPDATING //
const updateData = async (endpoint, id, data) => {
  try {
    const response = await customAxios.put(
      `/data/cards/${endpoint}/${id}`,
      data,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    return response.data
  } catch (error) {
    console.log('Error update data: ', error)
    throw error
  }
}

// DELETING //
const deleteData = async (endpoint, id) => {
  try {
    const response = await customAxios.delete(`/data/cards/${endpoint}/${id}`)

    return response.data
  } catch (error) {
    console.log('Error delete data: ', error)
    throw error
  }
}

export { serverData, addData, updateData, deleteData }
