const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError} = require('../errors')

const getAllProducts = async(req, res)=>{
  const products = await Product.find({})
  res.status(StatusCodes.OK).json({products})
}

const getProductById = async(req, res)=>{
  const productId = req.params.id
  const product = await Product.findOne({_id : productId})
  if(!product){
    throw new NotFoundError (`No product with id ${productId} found`)
  }
  res.status(StatusCodes.OK).json({product})
}

const createProduct = async(req, res)=>{
  req.body.createdBy = req.user.userId
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({product})
}

const updateProduct = async(req, res)=>{
  const productId = req.params.id
  const product = await Product.findOneAndUpdate({_id :productId}, req.body, {
    returnDocument: 'after',
    runValidators : true
  })
  if(!product){
    throw new NotFoundError (`No product with id ${productId} found`)
  }
  res.status(StatusCodes.OK).json({product})
} 

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct
}