const redis = require('redis')
const {client} = require('../config/redis')

const markSuccess = async(key, res)=>{
  const existing = await client.get(key);
  const data = JSON.parse(existing);
  const updated = {
  ...data,
  status: "SUCCESS",
  res
}
  await client.set(key, JSON.stringify(updated), {
    EX: 3600
  });
}

const markFailed = async(key)=>{
  console.log(key)
  await client.del(key)
}

module.exports = {markSuccess, markFailed}

