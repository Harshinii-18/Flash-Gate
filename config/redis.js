require('dotenv').config()
const redis = require('redis')

const client = redis.createClient({url: process.env.REDIS_URI});
client.on('error', err => console.log('Redis Client Error', err));

const connectRedis = async() =>{
  await client.connect();
  console.log('Redis Connected')
}

module.exports = {connectRedis, client}