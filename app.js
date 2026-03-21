require('dotenv').config()
const express = require('express')
const app = express()


//db
const connectDB = require('./db/connect')

//route
const authRouter = require('./routes/auth')

//import error middleware
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

//to get req.body
app.use(express.json())

//middleware
app.use('/api/v1/auth', authRouter)

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