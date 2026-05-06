const Reservation = require('../models/Reservation')
const Product = require('../models/Product')
const Order = require('../models/Order')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError, BadRequestError} = require('../errors')
const { markSuccess, markFailed } = require('../services/idempotency')


const createReservation = async(req, res)=>{
  try{
    //inputs
    const quantity = req.body.quantity

    //validate the product
    const product = await Product.findOne({_id : req.body.productId})
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
      _id : req.body.productId,
      $expr: {$gte : [{$subtract: ["$stock", "$reservedStock"]}, quantity]}
    },{
      $inc : {reservedStock : quantity}
    },{
      new : true,
      runValidators : true
    }
    )

    if(!updatedProduct){
      throw new BadRequestError('Not Enough Stock')
    }

    //create reservation
    const expiresAt = new Date(Date.now() + 10*60*1000)
    const reservation = await Reservation.create({
      user : req.user.userId,
      product : req.body.productId,
      quantity,
      expiresAt
    })
    const responseData = {
        success: true,
        data: reservation
    }
    // console.log("Waiting 12 seconds...");
    // await new Promise(resolve => setTimeout(resolve, 12000));
    // throw new error
    markSuccess(req.idempotencyKey, responseData)
    res.set('X-Idempotency-Status', 'CREATED');
    res.status(StatusCodes.CREATED).json(responseData)
  }catch(error){
    markFailed(req.idempotencyKey)
    throw error
  }
  
}

const getReservation = async(req, res)=>{
  const now = new Date()
  let reservation = await Reservation.findOneAndUpdate({_id : req.params.id,
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
    reservation = await Reservation.findById(req.params.id)
  }

  if(!reservation){
    throw new NotFoundError('Invalid reservation id')
  }
  res.status(StatusCodes.OK).json({reservation})
  
}

const confirmOrder = async(req, res)=>{
  let reservation = await Reservation.findOneAndUpdate({
    _id : req.params.id,
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
  res.status(StatusCodes.CREATED).json({order, product})
}



module.exports = {createReservation, getReservation, confirmOrder}