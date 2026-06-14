const redis = require('redis')
const {logger} = require('../config/logger')
const {RedisOperationError} = require('../errors')

const client = redis.createClient({url: process.env.REDIS_URI});
client.on('error', error =>  {logger.error({
  error: error.message,
  stack : error.stack
},'Redis client runtime error')
});

const connectRedis = async() =>{
  try {
    await client.connect();
    logger.info('Redis connected')
  } catch (error) {
    logger.error({
      error: error.message,
      stack : error.stack
    },
    'Redis startup connection failed'
    )
    throw new RedisOperationError('Redis startup failed')
  }
}

module.exports = {connectRedis, client}