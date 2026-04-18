const express = require('express')
const router = express.Router()
const {createReservation, getReservation, confirmOrder} = require('../controllers/reservation')


const {validateMiddleware} = require('../middleware/validate')
const {createReservationSchema,
  getReservationSchema,
  confirmOrderSchema
} = require('../validation/reservation')


router.route('/flash/reserve').post(validateMiddleware(createReservationSchema),createReservation)
router.route('/flash/confirm/:id').post(validateMiddleware(confirmOrderSchema, "params"),confirmOrder)   
router.route('/reservations/:id').get(validateMiddleware(getReservationSchema, "params"), getReservation)

module.exports = router
