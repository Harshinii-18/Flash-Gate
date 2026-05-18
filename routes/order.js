const express = require('express')
const router = express.Router()
const {confirmOrder, getAllOrders, getOrdersById} = require('../controllers/order')

const {validateMiddleware}= require('../middleware/validate')
const {idempotencyMiddleware} = require('../middleware/idempotency')
const {getOrdersByIdSchema, confirmOrderSchema} = require('../validation/order')
const orderService = require('../services/order')

router.route('/').get(getAllOrders)
router.route('/:id').get(validateMiddleware(getOrdersByIdSchema, "params"),getOrdersById)
router.route('/flash/confirm/:id').post(validateMiddleware(confirmOrderSchema, "params"), idempotencyMiddleware,confirmOrder,orderService.confirmOrder) 

module.exports = router