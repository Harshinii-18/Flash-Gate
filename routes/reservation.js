const express = require('express')
const router = express.Router()
const {createReservation, getReservation, confirmOrder} = require('../controllers/reservation')

router.route('/flash/reserve').post(createReservation)
router.route('/flash/confirm/:id').post(confirmOrder)   
router.route('/reservations/:id').get(getReservation)
// router.route('/reservations').get(getAllReservation)

module.exports = router
