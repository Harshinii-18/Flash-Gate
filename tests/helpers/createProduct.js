const Product = require('../../models/Product')
const createUser = require('./createUser')
const now = new Date()


const createProduct = async (overrides = {}) => {
  return await Product.create({
    name: 'iPhone',
    stock: 10,
    reservedStock: 0,
    price: 50000,
    flashSaleStart: new Date(now.getTime() - 60000),
    flashSaleEnd: new Date(now.getTime() + 3600000),
    ...overrides
  })

}

module.exports = createProduct