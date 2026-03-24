const Order = require('../models/Order')
const {StatusCodes} = require('http-status-codes')
const Product = require('../models/Product')
const {BadRequestError, NotFoundError} = require('../errors')


const createOrder = async(req, res)=>{
  //Get product
  const product = await Product.findOne({_id : req.body.productId})
  if(!product){
    throw new BadRequestError('Invalid product id')
  }

  //check flash sale timing
  const now = new Date()
  if(now < product.flashSaleStart || now > product.flashSaleEnd){
    throw new BadRequestError('Flash sale is not active')
  }

  //check stock & deduct stock
  if(product.stock == 0 || product.stock < req.body.quantity){
    throw new BadRequestError('Insufficient stock for the order placed')
  }
  product.stock -= req.body.quantity
  await product.save()

  //total price
  const totalPrice = req.body.quantity * product.price

  //create order

  req.body.user = req.user.userId
  const order = await Order.create({
    user : req.user.userId,
    product : req.body.productId,
    quantity : req.body.quantity,
    totalPrice : totalPrice})
  res.status(StatusCodes.CREATED).json({order, product})

}

module.exports = {createOrder}