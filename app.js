require('express-async-errors')
const express = require('express')
const app = express()

//route
const authRouter = require('./routes/auth')
const productRouter = require('./routes/product')
const orderRouter = require('./routes/order')
const reservationRouter = require('./routes/reservation')

//import logger middleware
const reqloggerMiddleware = require('./middleware/requestlogger')

//import auth middleware
const authMiddleware = require('./middleware/auth')

//import error middleware
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')

//to get req.body
app.use(express.json())

//routes
app.use('/api/v1/auth', reqloggerMiddleware, authRouter)
app.use('/api/v1/products', reqloggerMiddleware, authMiddleware, productRouter)
app.use('/api/v1/orders', reqloggerMiddleware, authMiddleware, orderRouter)
app.use('/api/v1', reqloggerMiddleware, authMiddleware, reservationRouter)

//error middlewares
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)


module.exports = app