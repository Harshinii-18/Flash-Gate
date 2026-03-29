const express = require('express')
const router = express.Router()
const {createReservation} = require('../controllers/reservation')

router.route('/reserve').post(createReservation)

module.exports = router
