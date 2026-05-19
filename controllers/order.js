const Order = require('../tempmodels/Order')
const {StatusCodes} = require('http-status-codes')
const Product = require('../tempmodels/Product')
const {BadRequestError, NotFoundError} = require('../errors')
const orderService = require('../services/order')

const confirmOrder = async(req, res)=>{
  const order = await orderService.confirmOrder({
    reservationId : req.params.id,
    idempotencyKey : req.idempotencyKey
  })
  const responseData = {
    success: true,
    data: order
  }
  res.set('X-Idempotency-Status', 'CREATED');
  res.status(StatusCodes.CREATED).json({responseData})  
}


const getAllOrders = async(req, res)=>{
  let orders;
  if(req.user.role === "Admin"){
    orders = await Order.find({})
  }else{
    orders = await Order.find({user : req.user.userId})
  }
  if(!orders){
    throw new NotFoundError ('No orders found')
  }
  const responseData = {
    success: true,
    data: orders
  }
  res.status(StatusCodes.OK).json(responseData)
  
}

const getOrdersById = async(req, res)=>{
  const orderId = req.params.id
  const order = await Order.findOne({_id : orderId, user: req.user.userId})
  if(!order){
    throw new NotFoundError (`No order with id ${orderId} found`)
  }
    const responseData = {
    success: true,
    data: order
  }
  res.status(StatusCodes.OK).json(responseData)
}
module.exports = {confirmOrder, getAllOrders, getOrdersById}