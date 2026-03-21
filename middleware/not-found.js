const {StatusCodes} = require('http-status-codes')
const notFoundMiddleware = (req, res)=>{
  res.status(StatusCodes.NOT_FOUND).json({error: "Route does not Exist"})
}

module.exports = notFoundMiddleware