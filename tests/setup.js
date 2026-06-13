require('dotenv').config({ path: '.env.test' })
const mongoose = require('mongoose')
const redis = require('redis')

//db
const connectDB = require('../db/connect')
//redis
const {connectRedis, client} = require('../config/redis')

const orderQueue = require('../queues/order')

beforeAll(async () => {
  console.log('TEST SETUP RUNNING')
  await connectDB(process.env.MONGO_URI)
  if (!client.isOpen) {
    await connectRedis()
  }
})

afterEach(async () => {
  //clear documents in mongo collections
  const collections = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }

  //clear Redis
  await client.flushDb()

  //clear queue
  await orderQueue.obliterate({ force: true })
})

afterAll(async () => {
  await mongoose.disconnect()
  await orderQueue.close()
  await client.quit()
})