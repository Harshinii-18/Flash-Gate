const User = require('../../models/User')
const crypto = require('crypto')



const createUser = async (overrides = {}) => {

  return await User.create({
    name: 'Test User',
    email: `test-${crypto.randomUUID()}@test.com`,
    password: 'password123',
    ...overrides
  })

}

module.exports = createUser