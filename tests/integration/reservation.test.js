const request = require('supertest')
const app = require('../../app')
const Product = require('../../models/Product')
const crypto = require('crypto')
const mongoose = require('mongoose')
//helper
const createUser = require('../helpers/createUser')
const createProduct = require('../helpers/createProduct')

describe('Reservation API', () => {

  test('creates reservation successfully', async () => {

    // Arrange
    const user = await createUser()
    const token = await user.createJWT()
    const admin = await createUser({
      role: 'Admin'
    })
    const product = await createProduct({createdBy: admin._id})
    console.log('Created product',product)

    // Act
    const response = await request(app)
      .post('/api/v1/flash/reserve')
      .set('Authorization', `Bearer ${token}`)
      .set('Idempotency-Key', `reservation-${crypto.randomUUID()}`)
      .send({
        productId: product._id,
        quantity: 2
      })

    // Assert
    expect(response.statusCode).toBe(201)
    expect(response.body.success).toBe(true)

  })

  test('returns 404 for invalid product', async () => {

    const user = await createUser()
    const token = await user.createJWT()

    const response = await request(app)
      .post('/api/v1/flash/reserve')
      .set('Authorization', `Bearer ${token}`)
      .set('Idempotency-Key', `reservation-${crypto.randomUUID()}`)
      .send({
        productId: '6854e05bcd27f1fdcf9f9999',
        quantity: 1
      })

    expect(response.statusCode).toBe(404)

  })

  test('returns 400 when stock is insufficient', async () => {

    const user = await createUser()
    const token = user.createJWT()

    const admin = await createUser({
      role: 'Admin'
    })
    const product = await createProduct({
      createdBy: admin._id,
      stock: 1
    })

    const response = await request(app)
      .post('/api/v1/flash/reserve')
      .set('Authorization', `Bearer ${token}`)
      .set('Idempotency-Key', `reservation-${crypto.randomUUID()}`)
      .send({
        productId: product._id,
        quantity: 5
      })

    expect(response.statusCode).toBe(400)

  })

})