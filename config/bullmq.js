const { Queue } = require('bullmq')

const connection ={
  url : process.env.REDIS_URI
}

module.exports = {connection}