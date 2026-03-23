const express = require('express')
const router = express.Router()
const roleMiddleware = require('../middleware/role')
const {getAllProducts,
  createProduct,
  getProductById,
  updateProduct
} = require('../controllers/product')


router.route('/').get(getAllProducts).post(roleMiddleware, createProduct)
router.route('/:id').get(getProductById).patch(roleMiddleware, updateProduct)

module.exports = router

