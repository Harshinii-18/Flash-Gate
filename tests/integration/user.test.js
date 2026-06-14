const User = require('../../models/User')
const createUser = require('../helpers/createUser')




describe('User Helper', () => {

  test('should create a user', async () => {
    
    const before = await User.countDocuments()
    await createUser()
    const after = await User.countDocuments()
    expect(after).toBe(before + 1)

  })

})