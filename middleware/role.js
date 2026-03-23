const {StatusCodes} = require('http-status-codes')
const {UnauthenticatedError} = require('../errors')
const role = async(req, res, next)=>{
  if(req.user.role !== 'Admin'){
    throw new UnauthenticatedError('Authentication Failed')
  }
  next()
}

module.exports = role