const pino = require('pino')

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  timestamp: pino.stdTimeFunctions.isoTime,
  base : null,
  transport: process.env.NODE_ENV !== 'production'? {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime : true
    }
  }: undefined

})

module.exports = { logger }