const SystemError = require('./system')
const {StatusCodes} = require('http-status-codes')
class InvariantViolationError extends SystemError {
  constructor(message){
    super(message)
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }
}

module.exports = InvariantViolationError