const Joi = require("joi")
const mongoose = require('mongoose')

const createOrderSchema = Joi.object({
  productId: Joi.string().length(24).required().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("Product Id");
      }
      return value;
    }, "ObjectId validation"),
  quantity: Joi.number().min(0).required()
}).options({ allowUnknown: false })

module.exports = {createOrderSchema}