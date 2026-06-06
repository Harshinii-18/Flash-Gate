const { Queue } = require('bullmq')
const { connection } = require('../config/bullmq')

const orderQueue = new Queue(
  'order-processing',
  { connection }
)

module.exports = orderQueue