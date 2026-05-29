const {logger} = require('../config/logger')
const { nanoid } = require('nanoid')

const log = async(req, res, next)=>{
  const start = Date.now()
  const requestId = `req_${nanoid()}`
  req.requestId = requestId
  logger.info({
      requestId: req.requestId,
      method: req.method,
      url: req.originalUrl
    },
    'Incoming request'
  )
  res.on('finish', ()=>{
    const duration = Date.now() - start
    logger.info(
    {
      requestId: req.requestId,
      statusCode : res.statusCode,
      durationMs : duration
    },
    'Request Completed'
  )
  })
  next()
}

module.exports = log