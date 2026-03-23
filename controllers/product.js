const Product = require('../models/Product')
const {StatusCodes} = require('http-status-codes')

const getAllProducts = async(req, res)=>{
  const products = await Product.find({})
  res.status(StatusCodes.OK).json({products})
}

const getProductById = async(req, res)=>{
  const productId = req.params.id
  const product = await Product.findOne({_id : productId})
  res.status(StatusCodes.OK).json({product})
}

const createProduct = async(req, res)=>{
  console.log(req.body)
  req.body.createdBy = req.user.userId
  const product = await Product.create(req.body)
  res.status(StatusCodes.CREATED).json({product})
}

// const getProductById = async(req, res)=>{
//   const products = await Product.find({})
// }

module.exports = {
  getAllProducts,
  createProduct,
  getProductById
}