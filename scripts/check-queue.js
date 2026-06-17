require('dotenv').config({ path: '.env.load' })

const { orderQueue } =
  require('../queues/order')

async function main() {

  console.log({
    waiting:
      await orderQueue.getWaitingCount(),

    active:
      await orderQueue.getActiveCount(),

    completed:
      await orderQueue.getCompletedCount(),

    failed:
      await orderQueue.getFailedCount()
  })

  process.exit(0)
}

main()