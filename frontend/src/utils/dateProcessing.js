// FUNCTION // Serializable for Function «new Date»
const getAllDateFn = (newDate) => {
  let hours = new Date(newDate).getHours()
  let minutes = new Date(newDate).getMinutes()
  let day = new Date(newDate).getDate()
  let month = new Date(newDate).getMonth() + 1
  const year = new Date(newDate).getFullYear()

  if (hours < 10) {
    hours = `0${hours}`
  }

  if (minutes < 10) {
    minutes = `0${minutes}`
  }

  if (day < 10) {
    day = `0${day}`
  }

  if (month < 10) {
    month = `0${month}`
  }

  return `${day}.${month}.${year} ${hours}:${minutes}`
}

export default getAllDateFn
