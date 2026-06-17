require('dotenv').config({ path: '.env.load' })

const fs = require('fs')

const connectDB = require('../db/connect')

const Reservation = require('../models/Reservation')
const Product = require('../models/Product')

const createUser = require('../tests/helpers/createUser')
const createProduct = require('../tests/helpers/createProduct')

async function main() {

  await connectDB(process.env.MONGO_URI)

  const user = await createUser()
  const token = await user.createJWT()
  // console.log(token)

  const admin = await createUser({
    role: 'Admin'
  })

  const product = await createProduct({
    stock: 100,
    reservedStock: 100,
    createdBy: admin._id
  })

  const reservationIds = []

  for(let i = 0; i < 100; i++) {

    const reservation =
      await Reservation.create({
        user: user._id,
        product: product._id,
        quantity: 1,
        status: 'ACTIVE',
        expiresAt: new Date(
          Date.now() + 60 * 60 * 1000
        )
      })

    reservationIds.push(
      reservation._id.toString()
    )
  }

  fs.writeFileSync(
    './tests/load/reservation-ids.json',
    JSON.stringify(reservationIds, null, 2)
  )

  console.log(
    `Created ${reservationIds.length} reservations`
  )

  process.exit(0)
}

main().catch(console.error)
