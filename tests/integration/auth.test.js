const request = require('supertest')
const app = require('../../app')
//helpers
const createUser = require('../helpers/createUser')


describe('Auth Middleware', () => {

  test('should allow access with valid token', async () => {

    const user = await createUser()
    const token = await user.createJWT()
    const response = await request(app)
      .get('/api/v1/products')
      .set('Authorization', `Bearer ${token}`)

  })

})