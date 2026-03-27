const express = require('express')
const router = express.Router()
const {createOrder} = require('../controllers/order')

const {validateMiddleware}= require('../middleware/validate')
const {createOrderSchema} = require('../validation/order')

router.route('/').post(validateMiddleware(createOrderSchema), createOrder)

module.exports = router