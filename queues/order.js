const { Queue } = require('bullmq')
const { connection } = require('../config/bullmq')

const orderQueue = new Queue(
  process.env.ORDER_QUEUE_NAME,
  { connection }
)

module.exports = orderQueue