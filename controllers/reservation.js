const Reservation = require('../models/Reservation')
const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError, BadRequestError} = require('../errors')


const createReservation = async(req, res)=>{
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
  res.status(StatusCodes.CREATED).json(reservation)
}

module.exports = {createReservation}