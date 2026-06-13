require('dotenv').config()
const app = require('./app')

//logger
const {logger} = require('./config/logger')

//db
const connectDB = require('./db/connect')

//redis
const {connectRedis} = require('./config/redis')

//port 
const port = process.env.PORT

//start fn
const start = async()=>{
  try {
    await connectDB(process.env.MONGO_URI)
    await connectRedis()
    app.listen(port, ()=>{
      logger.info(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    logger.error('Application startup failed')
  }
}
start()