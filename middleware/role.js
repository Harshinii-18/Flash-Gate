const {StatusCodes} = require('http-status-codes')
const {ForbiddenError} = require('../errors')
const adminRole = async(req, res, next)=>{
  if(req.user.role !== 'Admin'){
    throw new ForbiddenError('Authentication Failed')
  }
  next()
}

const userRole = async(req, res, next)=>{
  if(req.user.role !== 'User'){
    throw new ForbiddenError('Authentication Failed')
  }
  next()
}

module.exports = {adminRole, userRole}