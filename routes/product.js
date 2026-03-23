const express = require('express')
const router = express.Router()
const {getAllProducts,
  createProduct,
  getProductById
} = require('../controllers/product')


router.route('/').get(getAllProducts).post(createProduct)
router.route('/:id').get(getProductById)

module.exports = router

