const SystemError = require('./system')
const {StatusCodes} = require('http-status-codes')
class RedisOperationError extends SystemError {
  constructor(message){
    super(message)
    this.statusCode = StatusCodes.SERVICE_UNAVAILABLE
  }
}

module.exports = RedisOperationError