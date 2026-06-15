const Order = require('../models/Order')
const {StatusCodes} = require('http-status-codes')
const Product = require('../models/Product')
const Reservation = require('../models/Reservation')
const {BadRequestError, NotFoundError, ConflictError, CustomAPIError, InvariantViolationError, SystemError} = require('../errors')
const { markSuccess, markFailed } = require('./idempotency')
const {logger} = require('../config/logger')
const orderQueue = require('../queues/order')

const scheduleOrder = async({reservationId, idempotencyKey})=>{
  const job = await orderQueue.add(
  "PROCESS_ORDER",
    {reservationId, idempotencyKey},
    {attempts: 3, backoff: {type: "exponential",delay: 2000}}
  )

  logger.info({
    reservationId : reservationId
  },
  'Job Created for order processing'
  )
  return {
    jobId : job.id,
    name : job.name
  }
} 

const processOrder = async({reservationId, idempotencyKey})=>{
  
  let stockUpdated = false
  let orderCreated = false
  let reservation
  let product
  let quantity
  let order
  try{
    // throw new Error("Test retry");
    reservation = await Reservation.findOneAndUpdate({
    _id : reservationId,
    status : "ACTIVE",
    expiresAt : {$gt : new Date()}
  },{
    status : "PROCESSING",
  },{
    returnDocument : 'after',
    runValidators : true
  })

  if(!reservation){
    const existingReservation = await Reservation.findById(reservationId)
    if(!existingReservation){
      logger.warn({
        reservationId : reservationId
      },
      'Reservation invalid')
      throw new NotFoundError('Invalid reservation')
    }

    if(existingReservation.status==='COMPLETED'){
      logger.warn({
        reservationId : reservationId
      },
      'Duplicate reservation attempt')
      throw new ConflictError('Reservation already processed')
    }else if(existingReservation.status==='EXPIRED' || (existingReservation.status==='ACTIVE' && existingReservation.expiresAt<= new Date())){
      logger.warn({
        reservationId : reservationId,
        expiredAt : existingReservation.expiresAt
      },
      'Reservation expired')
      throw new BadRequestError('Reservation expired')
    }
  }
  //total price
  quantity = reservation.quantity
  product = await Product.findOneAndUpdate({
    _id :reservation.product,
    reservedStock : {$gte: quantity},
    stock : {$gte: quantity}
  },
  {
    $inc : {reservedStock : -quantity, stock : -quantity}
  },{
    returnDocument : 'after',
    runValidators : true
  })
  if(!product){
    logger.error({
      reservationId : reservationId,
      productId : reservation.product,
      quantity : quantity,
      reason: "Reserved stock lower than expected"
    },'Stock consistency check failed')
    throw new InvariantViolationError('Stock inconsistency detected')
  }
  stockUpdated = true
  const totalPrice = reservation.quantity * product.price

  order = await Order.create({
    user : reservation.user,
    product : reservation.product,
    quantity : reservation.quantity,
    totalPrice : totalPrice})
  orderCreated = true
  // console.log("Waiting 12 seconds...");
  // await new Promise(resolve => setTimeout(resolve, 12000));
  // throw new error

  reservation = await Reservation.findOneAndUpdate({
    _id : reservationId,
    status : "PROCESSING"
  },{
    status : "COMPLETED",
  },{
    returnDocument : 'after',
    runValidators : true
  })
  await markSuccess(idempotencyKey, {
    success: true,
    data: order
  })
  logger.info({
    orderId : order._id,
    productId : order.product,
    reservationId : reservation._id
  },
  'Order confirmed'
  )
  return order
  }catch(error){
    if(error instanceof CustomAPIError){
      await markSuccess(idempotencyKey, {
        success: false,
        data: error.message
      })
    }else{
      if(stockUpdated=== false){
        reservation = await Reservation.findOneAndUpdate(
        { _id : reservationId, status : "PROCESSING", expiresAt : {$gt : new Date()} },
        { status : "ACTIVE", },
        { returnDocument : 'after', runValidators : true }
      )
      }else if(stockUpdated===true && orderCreated===false){

        product = await Product.findOneAndUpdate({
          _id :reservation.product},
        {$inc : {reservedStock : +quantity, stock : +quantity}},
        {returnDocument : 'after', runValidators : true }
        )

        reservation = await Reservation.findOneAndUpdate(
        { _id : reservationId, status : "PROCESSING"},
        { status : "ACTIVE", },
        { returnDocument : 'after', runValidators : true })

      }else if(stockUpdated===true && orderCreated===true){
        logger.error({
          orderId : order._id
        }
          ,'Inconsistency after order creation')
      }
      await markFailed(idempotencyKey)
      }
      logger.warn({
        reservationId : reservationId,
        error: error.message
      },'Order failed')
      throw error  
    }   
}

module.exports = {scheduleOrder, processOrder}
