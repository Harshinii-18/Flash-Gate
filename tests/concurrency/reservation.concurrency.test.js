const request = require('supertest')
const app = require('../../app')

const Product = require('../../models/Product')
const Reservation = require('../../models/Reservation')

//helper
const createUser = require('../helpers/createUser')
const createProduct = require('../helpers/createProduct')

describe('Reservation Concurrency', () => {

  test('should never oversell stock', async () => {
     const user = await createUser()
    const token = await user.createJWT()
    const admin = await createUser({
          role: 'Admin'
    })
    const product = await createProduct({
      stock: 10,
      reservedStock: 0,
      createdBy: admin._id
    })
    const requests = Array.from(
      { length: 20 },
      (_, i) =>
        request(app)
          .post('/api/v1/flash/reserve')
          .set('Authorization', `Bearer ${token}`)
          .set('Idempotency-Key', `concurrency-${i}`)
          .send({
            productId: product._id,
            quantity: 1
          })
    )

    const responses = await Promise.all(requests)

    const successCount =
      responses.filter(
        r => r.statusCode === 201
      ).length

    const failureCount =
      responses.filter(
        r => r.statusCode === 400
      ).length

    const updatedProduct =
      await Product.findById(product._id)

    expect(successCount).toBe(10)

    expect(failureCount).toBe(10)

    expect(updatedProduct.stock)
      .toBe(10)

    expect(updatedProduct.reservedStock)
      .toBe(10)

  })

})