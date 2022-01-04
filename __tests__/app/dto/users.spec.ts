import { connect, clear, close } from '~/tests/db'
import { userList } from '~/app/dto'
import { UserModel } from '~/app/schemas'

describe('UserDto', () => {
  beforeAll(async () => await connect())
  beforeEach(async () => await clear())
  afterAll(async () => await close())

  it('should userList return correct data', async () => {
    const userData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      admin: false
    }
    await UserModel.create(userData)
    const data = await UserModel.find({})
    const result = userList(data)
    expect(result.length).toBe(1)
    expect(result[0]).toHaveProperty('id')
    expect(result[0]).toHaveProperty('createdAt')
    expect(result[0]).not.toHaveProperty('password')
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'any_name',
          email: 'any_email',
          admin: false
        })
      ])
    )
  })
})
