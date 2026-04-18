const express = require('express')
const router = express.Router()
const {createOrder, getAllOrders, getOrdersById} = require('../controllers/order')

const {validateMiddleware}= require('../middleware/validate')
const {getOrdersByIdSchema} = require('../validation/order')

router.route('/').get(getAllOrders)
router.route('/:id').get(validateMiddleware(getOrdersByIdSchema, "params"),getOrdersById)

module.exports = router