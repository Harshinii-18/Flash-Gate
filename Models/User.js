const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
  name : {
    type : String,
    required : [true, 'Please provide name'],
    minlength : 5,
    maxlength : 20
  },
  email : {
    type : String,
    required : [true, 'Please provide email'],
    unique : true,
    match : [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide valid email']
  },
  password : {
    type : String,
    required : [true, 'Please provide password'],
    minlength : 6
  },
  role : {
    type : String,
    default : 'User'
  }
})

//to save only hashed passwod in database
UserSchema.pre('save', async function(){
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

//to create jwt for user
UserSchema.methods.createJWT = function(){
const token = jwt.sign({userId: this._id, role: this.role}, process.env.JWT_SECRET, {expiresIn : process.env.JWT_LIFETIME})
return token
}

//to match input password with db password
UserSchema.methods.comparePassword = async function(inputPassword){
  const isMatch = await bcrypt.compare(inputPassword, this.password)
  return isMatch
}

module.exports = mongoose.model('User', UserSchema)