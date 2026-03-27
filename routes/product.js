const express = require('express')
const router = express.Router()
const roleMiddleware = require('../middleware/role')
const {getAllProducts,
  createProduct,
  getProductById,
  updateProduct
} = require('../controllers/product')
const {validateMiddleware} = require('../middleware/validate')
const {createProductSchema, updateProductSchema,getProductByIdSchema} = require('../validation/product')


router.route('/')
  .get(getAllProducts)
  .post(validateMiddleware(createProductSchema),roleMiddleware, createProduct)

router.route('/:id')
  .get(validateMiddleware(getProductByIdSchema, "params"),getProductById)
  .patch(validateMiddleware(updateProductSchema),roleMiddleware, updateProduct)

module.exports = router

