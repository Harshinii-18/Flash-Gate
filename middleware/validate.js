const {BadRequestError} = require('../errors')
const {StatusCodes} = require('http-status-codes')
const {logger} = require('../config/logger')

const validateMiddleware = (schema, source = "body") => {
  return (req, res, next) => {
    const data = req[source];
    const { error} = schema.validate(data)

    if (error) {
      logger.warn({
        requestId : req.requestId,
        route: req.route,
        validationError : error.details[0].message,
      },
      'Validation failed'
      )
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: error.details[0].message
      })
    }

    next();
  }
}

module.exports = {validateMiddleware}