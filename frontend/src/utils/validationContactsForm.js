// Validation for Input Fiels in Section «Contacts»
const patterns = {
  name: /^[a-zA-Zа-яА-Я- ]+$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^(\+7|7|8)?\d{10}$/,
}

// Test Validation Textpatterns
const validationContactsForm = (name, value) => {
  const defaultStateName = 'Вводите только буквы'
  const defaultStateEmail = 'Введите email, пример: you@email.com'
  const defaultStatePhone = 'Введите номер, 11 цифр, формат +7/7/8'

  if (value === '' && value === 'phone') {
    return 'Пожалуйста, заполните поле'
  }

  const pattern = patterns[name]

  switch (name) {
    case 'name':
      if (name === 'name' && value.length < 3) return 'Введите минимум 3 буквы'
      if (name === 'name' && !pattern.test(value)) return defaultStateName
      break
    case 'email':
      if (name === 'email' && !pattern.test(value)) return defaultStateEmail
      break
    case 'phone':
      if (value !== '' && !pattern.test(value)) return defaultStatePhone
      break
    case 'textarea':
      if (name === 'textarea' && value.length < 5)
        return 'Введите минимум 5 букв'
      break
    default:
      return
  }
}

export default validationContactsForm
