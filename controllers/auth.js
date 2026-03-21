const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {StatusCodes} =  require('http-status-codes')

const register = async(req, res)=>{
  const user = await User.create({...req.body})
  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({user :{id: user._id, name: user.name, email: user.email, role: user.role }, token})
  
}

const login = async(req, res)=>{
  res.send('logged in')
}

module.exports = {
  register,
  login
}