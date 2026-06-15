require('dotenv').config({ path: '.env.test' })
const mongoose = require('mongoose')
const redis = require('redis')
const crypto = require('crypto')
// const { startWorker } = require('../workers/order')

//db
const connectDB = require('../db/connect')
//redis
const {connectRedis, client} = require('../config/redis')
const orderQueue = require('../queues/order')
// let worker


beforeAll(async () => {
  await connectDB(process.env.MONGO_URI)
  if (!client.isOpen) {
    await connectRedis()
  }
  // worker = await startWorker()
})

beforeEach(async () => {
  //clear db
  await Promise.all(
  Object.values(mongoose.connection.collections)
    .map(collection => collection.deleteMany({}))
  )
  //clear Redis
  await client.flushDb()

  //clear queue
  // await orderQueue.obliterate({ force: true })
  await orderQueue.drain()
})

afterAll(async () => {
  await mongoose.disconnect()
  await orderQueue.close()
  // if(worker){
  //   await worker.close()
  // }
  await client.quit()
})