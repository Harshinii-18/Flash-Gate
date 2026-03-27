const {BadRequestError} = require('../errors')
const {StatusCodes} = require('http-status-codes')

const validateMiddleware = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source];
    const { error} = schema.validate(data)

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details[0].message
      })
    }

    next();
  }
}

module.exports = {validateMiddleware}