const Joi = require("joi")
const mongoose = require('mongoose')

const createReservationSchema = Joi.object({
  productId : Joi.string().length(24).required().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid productId")
      }
      return value
    }),
  quantity: Joi.number().min(1).required()
}).options({ allowUnknown: false })


const getReservationSchema = Joi.object({
  id : Joi.string().length(24).required().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid reservationId")
      }
      return value
    }),
}).options({ allowUnknown: false })

const confirmOrderSchema = Joi.object({
  id : Joi.string().length(24).required().custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.message("Invalid reservationId")
      }
      return value
    }),
}).options({ allowUnknown: false })

module.exports = {createReservationSchema, getReservationSchema, confirmOrderSchema}