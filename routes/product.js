const express = require('express')
const router = express.Router()
const {getAllProducts,
  createProduct,
  getProductById,
  updateProduct
} = require('../controllers/product')


router.route('/').get(getAllProducts).post(createProduct)
router.route('/:id').get(getProductById).patch(updateProduct)

module.exports = router

