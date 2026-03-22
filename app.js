require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()


//db
const connectDB = require('./db/connect')

//route
const authRouter = require('./routes/auth')

//import auth middleware
const authMiddleware = require('./middleware/auth')

//import error middleware
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

//to get req.body
app.use(express.json())

//middleware
app.use('/api/v1/auth', authMiddleware, authRouter)


//error middlewares
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

//port 
const port = process.env.PORT || 4000

//start fn
const start = async()=>{
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, ()=>{
      console.log(`Server is listening on port ${port}...`)
    })
  } catch (error) {
    console.log(error)
  }
}
start()