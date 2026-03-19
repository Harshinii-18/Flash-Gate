
const register = async(req, res)=>{
  res.send('registered')
}

const login = async(req, res)=>{
  res.send('logged in')
}

module.exports = {
  register,
  login
}