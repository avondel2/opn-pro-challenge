const express = require('express')
const bcrypt = require('bcrypt');
const { responseService } = require('./response.helper')
const { body, validationResult, matchedData } = require('express-validator');

const saltRounds = 10;

const app = express()
const port = 7777

// Mocking Bcrypt password from DB
const mockPassword = bcrypt.hashSync('123456', saltRounds)


app.use(express.json())
app.get('/', (req, res) => {
  return responseService(res, 0, 'HealthCheck')
})

const verifyToken =  (req, res, next) => {
  const auth = req.headers['authorization']
  if (typeof auth !== 'undefined') {
    try {
      const [bearer, token] = auth.split(' ')
      if (bearer !== 'Bearer' || token.split('_')[0] !== 'faketoken') throw new Error()
      req.payload = { user: token.split('_')[1] }
      next()
    } catch (err) {
      return responseService(res, 401)
    }
  } else {
    return responseService(res, 403)
  }
}

app.post(
  '/userLogin',
  body('email').isEmail().notEmpty(),
  body('password').isString().notEmpty(),
  (req, res) => {
    try {
      const result = validationResult(req)
      if (!result.isEmpty()) return responseService(res, 400)
      const { email, password } = req.body
      if (!bcrypt.compareSync(password, mockPassword)) return responseService(res, 0, 'Email or Password not match')
      const token = `faketoken_${email.split('@')[0]}`
      responseService(res, 0, { token })
    } catch (err) {
      console.log('err =>', err)
      return responseService(res, 500)
    }
  })

app.post(
  '/userRegister',
  body('email').isEmail(),
  body('password').isString().isLength({ min: 6 }),
  body('name').isString().notEmpty(),
  body('birthday').isISO8601().toDate(),
  body('gender').isString().notEmpty(),
  body('address').isString().notEmpty(),
  body('subscribe').isBoolean(),
  (req, res) => {
    try {
      const result = validationResult(req)
      if (!result.isEmpty()) return responseService(res, 400)
      const { email, password, name, birthday, gender, address, subscribe } = matchedData(req)
      const hashPass = bcrypt.hashSync(password, saltRounds)
      const saveToDB = {
        email,
        password: hashPass,
        name,
        birthday,
        gender,
        address,
        subscribe
      }
      return responseService(res, 201)
    } catch (err) {
      console.log('err =>', err)
      return responseService(res, 500)
    }
  })

app.get('/userGetProfile', verifyToken, (req, res) => {
  try {
    // Get Data from DB Where email = token
    responseService(res, 0, {
      email: `${req.payload.user}@gmail.com`,
      name: 'Chamod',
      birthday: '1994-11-21T00:00:00Z',
      gender: 'M',
      address: 'Bangkok',
      subscribe: true
    })
  } catch (err) {
    console.log('err =>', err)
    return responseService(res, 500)
  }
})

app.put(
  '/userEditProfile',
  verifyToken,
  body('birthday').isISO8601().toDate(),
  body('gender').isString().notEmpty(),
  body('address').isString().notEmpty(),
  body('subscribe').isBoolean(),
  (req, res) => {
    try {
      const result = validationResult(req)
      if (!result.isEmpty()) return responseService(res, 400)
      const { birthday, gender, address, subscribe } = matchedData(req)
      const updateToDB = {
        condition: "SELECT FROM email in token",
        birthday,
        gender,
        address,
        subscribe
      }
      responseService(res, 0)
    } catch (err) {
      console.log('err =>', err)
      return responseService(res, 500)
    }
  })

app.patch('/userChangePassword',
  verifyToken,
  body('password').isString(),
  body('newPassword').isString().isLength({ min: 6 }),
  (req, res) => {
    try {
      const result = validationResult(req)
      if (!result.isEmpty()) return responseService(res, 400)
      const { password, newPassword } = matchedData(req)
      if (!bcrypt.compareSync(password, mockPassword)) return responseService(res, 0, 'Password not match')
      const hashPass = bcrypt.hashSync(newPassword, saltRounds)
      const updateToDB = {
        condition: "SELECT FROM email in token",
        password: hashPass
      }
      responseService(res, 0)
    } catch (err) {
      console.log('err =>', err)
      return responseService(res, 500)
    }
  })

app.delete('/userDeleteAccount',
  verifyToken,
  body('password').isString(),
  (req, res) => {
    try {
      const result = validationResult(req)
      if (!result.isEmpty()) return responseService(res, 400)
      const { password } = matchedData(req)
      if (!bcrypt.compareSync(password, mockPassword)) return responseService(res, 0, 'Password not match')
      const deleteDataFromDB = {
        condition: 'SELECT FROM email'
      }
      responseService(res, 0)
    } catch (err) {
      console.log('err =>', err)
      return responseService(res, 500)
    }
  })

app.listen(port, () => {
  console.log(`Listening on PORT ${port}`)
}).on('error', (err) => {
  console.log('err =>', err);
  process.exit();
})
