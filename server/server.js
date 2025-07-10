import express from 'express'
import path from 'path'
import fs from 'fs'
import bodyParser from 'body-parser'
import multer from 'multer'
import cors from 'cors'
import { login, checkAuth } from './auth.js'
import https from 'https'

const __dirname = path.resolve()
console.log(__dirname)

// Пути к SSL сертификатам
const options = {
  key: fs.readFileSync(path.join(__dirname, 'ssl', 'certificate.key')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl', 'certificate.crt')),
  ca: fs.readFileSync(path.join(__dirname, 'ssl', 'certificate_ca.crt')),
}

const app = express()
const port = 443

// Настройка CORS
app.use(
  cors({
    origin: ['http://localhost:3000'],
  })
)

// Настройка middleware для парсинга JSON и URL-encoded данных
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Настройка статической папки
app.use('/uploads', express.static('uploads'))
app.use('/assets', express.static('assets'))
app.use(
  '/static',
  express.static(path.join(__dirname, '../frontend/build/static/'))
)

// Папки с JSON файлами и для загрузки файлов
const dataPath = path.join(__dirname, 'data/cards')
const formsPath = path.join(__dirname, 'data/forms')
const uploadsPath = path.join(__dirname, 'uploads')

// Создайте папку для загрузок, если ее нет
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath)
}

app.post('/admin', login)

// Настройка хранилища для файлов карточек
const cardStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('Request Body:', req.body) // Логируем req.body
    const { cardType } = req.body
    console.log('Card Type:', cardType) // Логируем cardType
    const formUploadPath = path.join(uploadsPath, cardType || 'default')
    if (!fs.existsSync(formUploadPath)) {
      fs.mkdirSync(formUploadPath, { recursive: true })
    }
    cb(null, formUploadPath)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const cardUpload = multer({ storage: cardStorage })

// Настройка хранилища для файлов форм
const formStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { id } = req.body
    const formUploadPath = path.join(uploadsPath, 'forms', id)
    if (!fs.existsSync(formUploadPath)) {
      fs.mkdirSync(formUploadPath, { recursive: true })
    }
    cb(null, formUploadPath)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

const formUpload = multer({ storage: formStorage })

// Вспомогательная функция для чтения JSON файлов
const readJsonFile = (filename, basePath = dataPath) => {
  try {
    const filePath = path.join(basePath, filename)
    return JSON.parse(fs.readFileSync(filePath, 'utf8')) || []
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error)
    return []
  }
}

// Вспомогательная функция для записи в JSON файл
const writeJsonFile = (filename, data, basePath = dataPath) => {
  try {
    const filePath = path.join(basePath, filename)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8')
  } catch (error) {
    console.error(`Error writing file ${filename}:`, error)
    throw error
  }
}

// Вспомогательная функция для обработки карточек
const handleCardOperation = (cardType, operation, id, data, filepath) => {
  const filename = `${cardType}.json`
  let cards = readJsonFile(filename)

  cards = cards.filter((item) => item && Object.keys(item).length > 0)
  if (operation === 'create') {
    if (cards.find((item) => item.id === id)) {
      throw new Error('Card with this ID already exists')
    }
    cards.push(data)
  } else if (operation === 'update') {
    const index = cards.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('Card not found')
    }
    if (cards[index].image && data.image !== cards[index].image) {
      deleteFile(__dirname + cards[index].image)
    }
    cards[index] = data
  } else if (operation === 'delete') {
    const index = cards.findIndex((item) => item.id === id)
    if (index !== -1 && cards[index].image) {
      const err = deleteFile(__dirname + cards[index].image)
      console.log('err', err)
    }
    cards = cards.filter((item) => item.id !== id)
  } else {
    throw new Error('Invalid operation')
  }

  writeJsonFile(filename, cards)
}

const deleteFile = (filepath) => {
  try {
    fs.unlink(filepath, (err) => {
      if (!err) {
        console.log('Файл', filepath, 'успешно удалён')
      } else {
        console.log(`Error deleting file ${filepath}:`, err)
      }
    })

    return null
  } catch (error) {
    console.error(`Error deleting file ${filepath}:`, error)
    return error
  }
}

// Маршруты для данных карточек
app.get('/data/cards/:cardType', (req, res) => {
  const { cardType } = req.params
  try {
    const data = readJsonFile(`${cardType}.json`)
    res.json(data)
  } catch (error) {
    console.error(`Error in /data/cards/${cardType} route:`, error)
    res.status(500).send('Internal Server Error')
  }
})

app.post(
  '/data/cards/:cardType',
  checkAuth,
  cardUpload.single('image'),
  (req, res) => {
    const { cardType } = req.params
    const newCard = req.body

    let imageUrl = ''
    if (req.file) {
      newCard.image = `/uploads/default/${req.file.filename}`
      imageUrl = `/uploads/default/${req.file.filename}`
    }

    if (!newCard.id || Object.keys(newCard).length === 0) {
      return res.status(400).send('Invalid card data')
    }

    try {
      handleCardOperation(cardType, 'create', newCard.id, newCard)
      res.status(201).json({
        message: `${
          cardType.charAt(0).toUpperCase() + cardType.slice(1)
        } created`,
        imageUrl: imageUrl,
      })
      //.send(`${cardType.charAt(0).toUpperCase() + cardType.slice(1)} created`)
    } catch (error) {
      console.error(`Error creating ${cardType}:`, error)
      res.status(500).send('Internal Server Error')
    }
  }
)

app.put(
  '/data/cards/:cardType/:id',
  checkAuth,
  cardUpload.single('image'),
  (req, res) => {
    const { cardType, id } = req.params
    const updatedCard = req.body
    let imageUrl = ''
    if (req.file) {
      updatedCard.image = `/uploads/default/${req.file.filename}`
      imageUrl = `/uploads/default/${req.file.filename}`
    }

    if (Object.keys(updatedCard).length === 0) {
      return res.status(400).send('Invalid card data')
    }

    try {
      handleCardOperation(cardType, 'update', id, updatedCard)
      res.status(200).json({
        message: `${
          cardType.charAt(0).toUpperCase() + cardType.slice(1)
        } created`,
        imageUrl: imageUrl,
      })
      // .send(`${cardType.charAt(0).toUpperCase() + cardType.slice(1)} updated`)
    } catch (error) {
      console.error(`Error updating ${cardType}:`, error)
      res.status(500).send('Internal Server Error')
    }
  }
)

app.delete('/data/cards/:cardType/:id', checkAuth, (req, res) => {
  const { cardType, id } = req.params
  try {
    handleCardOperation(cardType, 'delete', id)
    res
      .status(200)
      .send(
        `${
          cardType.charAt(0).toUpperCase() + cardType.slice(1)
        } with id ${id} deleted`
      )
  } catch (error) {
    console.error(`Error deleting ${cardType}:`, error)
    res.status(500).send('Internal Server Error')
  }
})

// Вспомогательная функция для обработки форм
const handleFormOperation = (operation, id, data) => {
  const filename = 'forms.json'
  let forms = readJsonFile(filename, formsPath)

  forms = forms.filter((item) => item && Object.keys(item).length > 0)

  if (operation === 'create') {
    if (forms.find((item) => item.id === id)) {
      throw new Error('Form with this ID already exists')
    }
    forms.push(data)
  } else if (operation === 'update') {
    const index = forms.findIndex((item) => item.id === id)
    if (index === -1) {
      throw new Error('Form not found')
    }
    forms[index] = data
  } else if (operation === 'delete') {
    forms = forms.filter((item) => item.id !== id)
  } else {
    throw new Error('Invalid operation')
  }

  writeJsonFile(filename, forms, formsPath)

  if (operation === 'delete') {
    const formUploadPath = path.join(uploadsPath, 'forms', id)
    if (fs.existsSync(formUploadPath)) {
      fs.rmSync(formUploadPath, { recursive: true, force: true })
    }
  }
}

// Маршруты для форм
app.get('/data/forms', (req, res) => {
  try {
    const data = readJsonFile('forms.json', formsPath)
    res.json(data)
  } catch (error) {
    console.error('Error in /data/forms route:', error)
    res.status(500).send('Internal Server Error')
  }
})

app.post('/data/forms', formUpload.array('files'), (req, res) => {
  try {
    const newForm = req.body

    if (req.files && req.files.length > 0) {
      newForm.files = req.files.map(
        (file) => `${uploadsPath}/forms/${newForm.id}/${file.filename}`
      )
    }

    if (!newForm.id || Object.keys(newForm).length === 0) {
      return res.status(400).send('Invalid form data')
    }

    handleFormOperation('create', newForm.id, newForm)
    res.status(201).send('Form created')
  } catch (error) {
    console.error('Error creating form:', error)
    res.status(500).send('Internal Server Error')
  }
})

app.put('/data/forms/:id', formUpload.array('files'), (req, res) => {
  const { id } = req.params
  const updatedForm = req.body

  if (req.files && req.files.length > 0) {
    updatedForm.files = req.files.map(
      (file) => `${uploadsPath}/forms/${id}/${file.filename}`
    )
  }

  if (Object.keys(updatedForm).length === 0) {
    return res.status(400).send('Invalid form data')
  }

  try {
    handleFormOperation('update', id, updatedForm)
    res.status(200).send('Form updated')
  } catch (error) {
    console.error('Error updating form:', error)
    res.status(500).send('Internal Server Error')
  }
})

app.delete('/data/forms/:id', checkAuth, (req, res) => {
  const { id } = req.params
  try {
    handleFormOperation('delete', id)
    res.status(200).send(`Form with id ${id} deleted`)
  } catch (error) {
    console.error('Error deleting form:', error)
    res.status(500).send('Internal Server Error')
  }
})

// Обработка маршрутов для фронтенда
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
})

// Обработка маршрутов для фронтенда
// app.get('/adminpanel', checkAuth(req, res) => {
//   res.sendFile(path.join(__dirname, '../frontend/build/index.html'))
// })

// app.listen(port, () => {
//   console.log(`Server is running on https://localhost:${port}`)
// })

https.createServer(options, app).listen(port, () => {
  console.log(`Server is running on https://localhost:${port}`)
})

//app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);
