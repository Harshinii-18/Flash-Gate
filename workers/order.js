require('dotenv').config()
//db
const connectDB = require('../db/connect')
const { Worker } = require('bullmq')
const { connection } = require('../config/bullmq')
const {processOrder}= require('../services/order')
const {logger} = require('../config/logger')
//redis
const {connectRedis} = require('../config/redis')

const startWorker = async()=>{
  try{
    await connectDB(process.env.MONGO_URI)
    await connectRedis()
    const worker = new Worker(
      'order-processing',
      async (job) => {
        const {reservationId,idempotencyKey} = job.data
        const order = await processOrder({reservationId, idempotencyKey})
        return order
      },
      { connection }
    )

    //worker events
    worker.on('active', (job) => {
      logger.info({
        jobId: job.id,
        reservationId: job.data.reservationId,
        attempt: job.attemptsMade + 1
      }, 'Job started processing')
    })

    worker.on('completed', (job, result) => {
      logger.info({
        jobId: job.id,
        reservationId: job.data.reservationId,
        orderId: result.orderId,
      }, 'Job completed')
    })

    worker.on('failed', (job, err) => {
      logger.error({
        jobId: job.id,
        reservationId: job.data.reservationId,
        attempt: job.attemptsMade,
        error: err.message,
        stack: err.stack
      }, 'Job failed')
    })

  }catch(error){
     logger.error({
      error: err.message
    },
     'Worker startup failed')
  }
}

startWorker()
