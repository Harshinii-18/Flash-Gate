const Reservation = require('../../models/Reservation')
//helpers
const createUser = require('./createUser')
const createProduct = require('./createProduct')


const createReservation = async (overrides = {}) => {
  const admin = await createUser({
      role: 'Admin'
    })

  const product = await createProduct({createdBy: admin._id})

  return await Reservation.create({
    product: product._id,
    quantity: 2,
    status: 'ACTIVE',
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    ...overrides
  })
}

module.exports = createReservation