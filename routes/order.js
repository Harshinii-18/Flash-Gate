const express = require('express')
const router = express.Router()
const {createOrder, getAllOrders, getOrdersById} = require('../controllers/order')

const {validateMiddleware}= require('../middleware/validate')

router.route('/').get(getAllOrders)
router.route('/:id').get(getOrdersById)

module.exports = router