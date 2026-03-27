const express = require('express')
const router = express.Router()
const {register,
  login} = require('../controllers/auth')

const {registerSchema, loginSchema} = require('../validation/auth')
const {validateMiddleware} = require('../middleware/validate')

router.post('/register',validateMiddleware(registerSchema), register)
router.post('/login',validateMiddleware(loginSchema), login)

module.exports = router