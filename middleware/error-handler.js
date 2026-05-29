const {StatusCodes} = require('http-status-codes')
const {CustomAPIError, SystemError} = require('../errors')
const {logger} = require('../config/logger')

const errorHandlerMiddleware = (err, req, res, next)=>{
  logger.error({
    requestId : req.requestId,
    route : req.originalUrl,
    errormessage: err.message,
    statuscode : err.statusCode,
    stack : err.stack
  },
    'Technical failure context'
  )
  if(err instanceof CustomAPIError || err instanceof SystemError){
    return res.status(err.statusCode).json({msg : err.message})
  }
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(err.message)
}

module.exports = errorHandlerMiddleware