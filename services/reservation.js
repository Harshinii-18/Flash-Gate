const Reservation = require('../models/Reservation')
const Product = require('../models/Product')
const Order = require('../models/Order')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError, BadRequestError, ForbiddenError} = require('../errors')
const { markSuccess, markFailed } = require('./idempotency')


const createReservation = async({productId,
  quantity,
  user,
  idempotencyKey})=>{
  try{
    //validate the product
    const product = await Product.findById(productId);
    if(!product){
      throw new NotFoundError('Invalid product id')
    }

    //check flash sale timing
    const now = new Date()
    if(now < product.flashSaleStart || now > product.flashSaleEnd){
      throw new BadRequestError('Flash sale is not active')
    }

    //atomic update
    const updatedProduct = await Product.findOneAndUpdate({
      _id : productId,
      $expr: {$gte : [{$subtract: ["$stock", "$reservedStock"]}, quantity]}
    },{
      $inc : {reservedStock : quantity}
    },{
      returnDocument : 'after',
      runValidators : true
    }
    )

    if(!updatedProduct){
      throw new BadRequestError('Not Enough Stock')
    }

    //create reservation
    const expiresAt = new Date(Date.now() + 10*60*1000)
    const reservation = await Reservation.create({
      user : user,
      product : productId,
      quantity,
      expiresAt
    })
    // console.log("Waiting 12 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 12000));
    // throw new error
    await markSuccess(idempotencyKey,  {
        success: true,
        data: reservation
    })
    return reservation
  }catch(error){
    await markFailed(idempotencyKey)
    throw error
  }
  
}

const getReservation = async({id, userId, role})=>{
  const now = new Date()
  let reservation = await Reservation.findOneAndUpdate({_id : id,
     status : "ACTIVE",
     expiresAt : {$lt : now}
    }, {
      status : "EXPIRED"
    },{
      returnDocument : 'after',
      runValidators : true
    })
  
  if(reservation){
    await Product.findByIdAndUpdate(reservation.product, {
      $inc : {reservedStock : -reservation.quantity}
    })
  }else{
    reservation = await Reservation.findById(id)
  }

  if(!reservation){
    throw new NotFoundError('Invalid reservation id')
  }

  if(role === 'User' && reservation.user.toString() !== userId){
    throw new ForbiddenError('Cannot access reservation')
  }
  return reservation
}



module.exports = {createReservation, getReservation}