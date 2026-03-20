const express = require('express')
const router = express.Router()
const {register,
  login,
createUser} = require('../controllers/auth')

router.post('/register',register)
router.post('/login',login)

//createUserDemo
// router.post('/createuser',createUser)

module.exports = router