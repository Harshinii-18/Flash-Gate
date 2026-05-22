const express = require('express')
const router = express.Router()
const {adminRole} = require('../middleware/role')
const {getAllProducts,
  createProduct,
  getProductById,
  updateProduct
} = require('../controllers/product')
const {validateMiddleware} = require('../middleware/validate')
const {createProductSchema, updateProductSchema,getProductByIdSchema} = require('../validation/product')


router.route('/')
  .get(adminRole, getAllProducts)
  .post(validateMiddleware(createProductSchema),adminRole, createProduct)

router.route('/:id')
  .get(validateMiddleware(getProductByIdSchema, "params"),getProductById)
  .patch(validateMiddleware(updateProductSchema),adminRole, updateProduct)

module.exports = router

