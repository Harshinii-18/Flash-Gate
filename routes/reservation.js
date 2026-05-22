const express = require('express')
const router = express.Router()
const {createReservation, getReservation, confirmOrder} = require('../controllers/reservation')
const reservationService = require('../services/reservation')


const {validateMiddleware} = require('../middleware/validate')
const {createReservationSchema,
  getReservationSchema
} = require('../validation/reservation')

const {idempotencyMiddleware} = require('../middleware/idempotency')
const {userRole}= require('../middleware/role')


router.route('/flash/reserve').post(validateMiddleware(createReservationSchema), userRole, idempotencyMiddleware,createReservation, reservationService.createReservation) 
router.route('/reservations/:id').get(validateMiddleware(getReservationSchema, "params"), getReservation, reservationService.getReservation)

module.exports = router
