const {StatusCodes} = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next)=>{
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({err})
}

module.exports = errorHandlerMiddleware