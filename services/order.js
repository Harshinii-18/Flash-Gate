const Order = require('../tempmodels/Order')
const {StatusCodes} = require('http-status-codes')
const Product = require('../tempmodels/Product')
const Reservation = require('../tempmodels/Reservation')
const {BadRequestError, NotFoundError} = require('../errors')
const { markSuccess, markFailed } = require('./idempotency')

const confirmOrder = async({reservationId, idempotencyKey})=>{
  try{
    let reservation = await Reservation.findOneAndUpdate({
    _id : reservationId,
    status : "ACTIVE",
    expiresAt : {$gt : new Date()}
  },{
    status : "COMPLETED",
  },{
    returnDocument : 'after',
    runValidators : true
  })

  if(!reservation){
    throw new NotFoundError('Reservation invalid or already processed')
  }
  //total price
  const quantity = reservation.quantity
  const product = await Product.findOneAndUpdate({
    _id :reservation.product,
    reservedStock : {$gte: quantity}},
  {
    $inc : {reservedStock : -quantity, stock : -quantity}
  },{
    returnDocument : 'after',
    runValidators : true
  })
  if(!product){
    throw new BadRequestError('Stock inconsistency detected')
  }
  const totalPrice = reservation.quantity * product.price

  const order = await Order.create({
    user : reservation.user,
    product : reservation.product,
    quantity : reservation.quantity,
    totalPrice : totalPrice})
  // console.log("Waiting 12 seconds...");
  // await new Promise(resolve => setTimeout(resolve, 12000));
  // throw new error
  await markSuccess(idempotencyKey, {
    success: true,
    data: order
  })
  return order
  }catch(error){
    await markFailed(idempotencyKey)
    throw error
  } 
}

module.exports = {confirmOrder}
