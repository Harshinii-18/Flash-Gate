const redis = require('redis')
const {client} = require('../config/redis')
const {ConflictError, BadRequestError} = require('../errors')
const stringify = require('fast-json-stable-stringify')
const crypto = require('crypto');
const {logger} = require('../config/logger')

const idempotencyMiddleware = async(req, res, next)=>{

  const payload = {
    body : req.body,
    userId : req.user.userId,
    params: req.params,
    method : req.method
  }
  const normPayload = stringify(payload)
  const hash = crypto
  .createHash('sha256')
  .update(normPayload)
  .digest('hex')

  const rawKey = req.headers['idempotency-key'];
  if(!rawKey)
    throw new BadRequestError('Missing idempotency key')
  const idemKey = `idem:${rawKey}`
  const existing = await client.get(idemKey);
  

  if(existing){
    const content = JSON.parse(existing)
    if(content.requestHash !== hash){
      logger.info({
        requestId : req.requestId,
        idempotencyKey : rawKey
      },
      'Duplicate Idempotency request'
      )
        throw new ConflictError('Idempotency key reused with different request')
      }
    

    if(content.status ==="PROCESSING"){
      throw new ConflictError('Request already in progress')
    }else if(content.status === "SUCCESS"){
      res.set('X-Idempotency-Status', 'CACHED');
      logger.info({
        requestId : req.requestId,
        idempotencyKey : rawKey
      },
      'Returned cached response'
      )
      return res.status(200).json(content.res)
    }
  }

  const value = JSON.stringify({
  status: "PROCESSING",
  requestHash : hash
  });
  const ttl = 60;

  const result = await client.set(idemKey, value, {
    NX: true,
    EX: ttl
  });

   if (result !== "OK") {
    logger.info({
      requestId : req.requestId,
      idempotencyKey : rawKey
    },
    'Duplicate Idempotency request'
    )
    throw new ConflictError("Duplicate request");
  }
  req.idempotencyKey = idemKey;
  req.requestHash = hash;
  next()

}

module.exports = {idempotencyMiddleware}