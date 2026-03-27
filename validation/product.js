const Joi = require("joi")
const mongoose = require('mongoose')

const createProductSchema = Joi.object({
  name: Joi.string().min(5).max(30).required(),
  price: Joi.number().min(0).required(),
  stock : Joi.number().min(0).required(),
  flashSaleStart: Joi.date().required(),
  flashSaleEnd: Joi.date().required()
}).options({ allowUnknown: false })

const updateProductSchema = Joi.object({
  name: Joi.string().min(5).max(30),
  price: Joi.number().min(0),
  stock : Joi.number().min(0),
  flashSaleStart: Joi.date(),
  flashSaleEnd: Joi.date()
}).options({ allowUnknown: false })

const getProductByIdSchema = Joi.object({
  id: Joi.string().length(24).required()
  .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("Product id");
      }
      return value;
    }, "ObjectId validation")
}).options({ allowUnknown: false })

module.exports = {createProductSchema,updateProductSchema, getProductByIdSchema}