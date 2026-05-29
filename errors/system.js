class SystemError extends Error{
  constructor (message){
    super(message)
  }
}

module.exports = SystemError