const express = require('express')
const router = express.Router()
const {createOrder} = require('../controllers/order')
console.log('Router loading')

router.route('/').post(createOrder)

module.exports = router