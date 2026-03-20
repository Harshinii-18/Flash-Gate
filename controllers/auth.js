const User = require('../models/User')

const register = async(req, res)=>{
  res.send('registered')
}

const login = async(req, res)=>{
  res.send('logged in')
}

//create user demo
// const createUser = async(req, res)=>{
//   const user = await User.create(req.body)
//   res.status(200).json(user)
// }
module.exports = {
  register,
  login
}