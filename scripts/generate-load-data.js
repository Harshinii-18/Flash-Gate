require('dotenv').config({ path: '.env.load' })
const mongoose = require('mongoose')
const redis = require('redis')
const crypto = require('crypto')

//db
const connectDB = require('../db/connect')
//redis
const {connectRedis, client} = require('../config/redis')
const orderQueue = require('../queues/order')
// let worker


//helper
const createUser = require('../tests/helpers/createUser')
const createProduct = require('../tests/helpers/createProduct')


const loadData = async()=>{

  await connectDB(process.env.MONGO_URI)
  if (!client.isOpen) {
    await connectRedis()
  }

    await Promise.all(
    await Object.values(mongoose.connection.collections)
      .map(collection => collection.deleteMany({}))
    )
    //clear Redis
    await client.flushDb()

const user = await createUser()
const token = await user.createJWT()
console.log(token)
const admin = await createUser({
  role: 'Admin'
})
const product = await createProduct({createdBy: admin._id})
console.log(product._id)

}

loadData()




// $env:PRODUCT_ID=""
// $env:TOKEN=""
