const Joi = require("joi")

// Register Schema
const registerSchema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
}).options({ allowUnknown: false })

// Login Schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
}).options({ allowUnknown: false })

module.exports = {
  registerSchema,
  loginSchema
}