const {StatusCodes} = require('http-status-codes')
const {ForbiddenError} = require('../errors')
const role = async(req, res, next)=>{
  if(req.user.role !== 'Admin'){
    throw new ForbiddenError('Authentication Failed')
  }
  next()
}

module.exports = role