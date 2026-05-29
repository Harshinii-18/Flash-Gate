const mongoose = require('mongoose')
const {logger} = require('../config/logger')
const connectDB = async(url) => {
  try{
    return await mongoose.connect(url)
  }catch(error){
    logger.error({
      error: error.message,
      stack : error.stack
    },
    'Mongodb startup connection failed'
    )
    throw error
  }

}

module.exports = connectDB