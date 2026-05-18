const Joi = require("joi")
const mongoose = require('mongoose')

const confirmOrderSchema = Joi.object({
  id : Joi.string().length(24).required().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid reservationId")
      }
      return value
    }),
}).options({ allowUnknown: false })

const getOrdersByIdSchema = Joi.object({
  id: Joi.string().length(24).required()
  .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("Order id");
      }
      return value;
    }, "ObjectId validation")
}).options({ allowUnknown: false })



module.exports = {getOrdersByIdSchema, confirmOrderSchema}