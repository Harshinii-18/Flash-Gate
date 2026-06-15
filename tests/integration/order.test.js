const crypto = require('crypto')
const request = require('supertest')
const app = require('../../app')
const orderService = require('../../services/order')


//helper
const createReservation = require('../helpers/createReservation')
const createUser = require('../helpers/createUser')

// //queue
// const orderQueue = require('../../queues/order')


describe('Confirm Order API', () => {

  test('returns 202 when order processing is scheduled', async () => {
  const user = await createUser()
  const token = user.createJWT()

  const reservation = await createReservation({
    user: user._id
  })

  const response = await request(app)
    .post(`/api/v1/orders/flash/confirm/${reservation._id}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Idempotency-Key', `confirm-${crypto.randomUUID()}`)

  expect(response.statusCode).toBe(202)
})

test('creates PROCESS_ORDER job', async () => {

  const user = await createUser()
  const token = user.createJWT()

  const reservation = await createReservation({
    user: user._id
  })

  const response = await request(app)
    .post(`/api/v1/orders/flash/confirm/${reservation._id}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Idempotency-Key', `confirm-${crypto.randomUUID()}`)

  expect(response.body.responseData.data.name)
    .toBe('PROCESS_ORDER')

  expect(response.body.responseData.data.jobId)
    .toBeDefined()

})

test('returns 409 when same key is reused with different reservation', async () => {

  const user = await createUser()
  const token = user.createJWT()

  const reservation1 = await createReservation({
    user: user._id
  })

  const reservation2 = await createReservation({
    user: user._id
  })

  const key = `confirm-${crypto.randomUUID()}`

  await request(app)
    .post(`/api/v1/orders/flash/confirm/${reservation1._id}`)
    .set('Authorization', `Bearer ${token}`)
    .set('Idempotency-Key', key)

  const response = await request(app)
    .post(`/api/v1/orders/flash/confirm/${reservation2._id}/`)
    .set('Authorization', `Bearer ${token}`)
    .set('Idempotency-Key', key)

  expect(response.statusCode).toBe(409)

})



// test('returns cached response after processing completes', async () => {

//   const user = await createUser()
//   const token = user.createJWT()

//   const reservation = await createReservation({
//     user: user._id
//   })

//   const key = `confirm-${crypto.randomUUID()}`

//   const firstResponse = await request(app)
//     .post(`/api/v1/orders/flash/confirm/${reservation._id}`)
//     .set('Authorization', `Bearer ${token}`)
//     .set('Idempotency-Key', key)

//   expect(firstResponse.statusCode).toBe(202)

//   // Wait for worker to finish
//   await waitForReservationCompletion(
//     reservation._id
//   )

//   const replayResponse = await request(app)
//     .post(`/api/v1/orders/flash/confirm/${reservation._id}`)
//     .set('Authorization', `Bearer ${token}`)
//     .set('Idempotency-Key', key)

//   expect(replayResponse.statusCode).toBe(200)

//   expect(
//     replayResponse.headers['x-idempotency-status']
//   ).toBe('CACHED')

// })

})