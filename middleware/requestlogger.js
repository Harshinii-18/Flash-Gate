const {logger} = require('../config/logger')
const { nanoid } = require('nanoid')

const log = async(req, res, next)=>{
  const requestId = `req_${nanoid()}`
  req.requestId = requestId
  logger.info(
    {
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl
    },
    'Incoming request'
  )

  next()
}

module.exports = log