const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {StatusCodes} =  require('http-status-codes')
const {UnauthenticatedError, BadRequestError} = require('../errors')

const register = async(req, res)=>{

  const {name,email, password} = req.body
  const existingUser = await User.findOne({email});
  if (existingUser) {
    throw new BadRequestError('User already exists with this email');
  }
  const user = await User.create({
    name, email, password, role : "User"
  })
  const token = user.createJWT()
  const responseData = {
    success: true,
    data : {user :{id: user._id, name: user.name, email: user.email, role: user.role }, token}
  }
  res.status(StatusCodes.CREATED).json(responseData)
  
}

const login = async(req, res)=>{
  const {email, password} = req.body
  const user = await User.findOne({email})
  if(!user){
    throw new UnauthenticatedError('Invalid credentials')
  }
  const isMatch = await user.comparePassword(password)
  if(!isMatch){
    throw new UnauthenticatedError('Invalid credentials')
  }
  const token = user.createJWT()
  const responseData = {
    success: true,
    data : {user :{id: user._id, name: user.name, email: user.email, role: user.role }, token}
  }
  res.status(StatusCodes.OK).json(responseData)

}

module.exports = {
  register,
  login
}