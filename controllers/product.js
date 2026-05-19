const Product = require('../tempmodels/Product')
const {StatusCodes} = require('http-status-codes')
const {NotFoundError} = require('../errors')

const getAllProducts = async(req, res)=>{
  const products = await Product.find({})
  const responseData = {
    success : true,
    data : products
  }
  res.status(StatusCodes.OK).json(responseData)
}

const getProductById = async(req, res)=>{
  const productId = req.params.id
  const product = await Product.findOne({_id : productId})
  if(!product){
    throw new NotFoundError (`No product with id ${productId} found`)
  }
  const responseData = {
    success : true,
    data : product
  }
  res.status(StatusCodes.OK).json(responseData)
}

const createProduct = async(req, res)=>{
  req.body.createdBy = req.user.userId
  const product = await Product.create(req.body)
    const responseData = {
    success : true,
    data : product
  }
  res.status(StatusCodes.CREATED).json(responseData)
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
  const responseData = {
    success : true,
    data : product
  }
  res.status(StatusCodes.OK).json(responseData)
} 

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct
}