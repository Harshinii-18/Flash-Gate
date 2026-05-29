const SystemError = require('./system')
const {StatusCodes} = require('http-status-codes')
class DBConsistencyError extends SystemError {
  constructor(message){
    super(message)
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR
  }
}

module.exports = DBConsistencyError