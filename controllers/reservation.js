const Reservation = require('../models/Reservation')
const Product = require('../models/Product')
const Order = require('../models/Order')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError, BadRequestError} = require('../errors')
const { markSuccess, markFailed } = require('../services/idempotency')
const reservationService = require('../services/reservation')


const createReservation = async(req, res)=>{
  const reservation = await reservationService.createReservation({
    productId : req.body.productId,
    quantity : req.body.quantity,
    user : req.user.userId,
    idempotencyKey : req.idempotencyKey
  })
  const responseData = {
      success: true,
      data: reservation
  }
  // console.log("Waiting 12 seconds...");
  // await new Promise(resolve => setTimeout(resolve, 12000));
  // throw new error
  // markSuccess(req.idempotencyKey, responseData)
  res.set('X-Idempotency-Status', 'CREATED');
  res.status(StatusCodes.CREATED).json(responseData)
  
}

const getReservation = async(req, res)=>{
  const reservation = await reservationService.getReservation({
    id : req.params.id
  })
  const responseData = {
        success: true,
        data: reservation
    }
  res.status(StatusCodes.OK).json(responseData)
}

module.exports = {createReservation, getReservation}