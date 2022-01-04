import { connect, clear, close } from '~/tests/db'
import { UserRepository } from '~/app/repositories'
import { UserModel } from '~/app/schemas'

describe('UserRepository', () => {
  let sut: UserRepository

  beforeAll(async () => {
    await connect()
    sut = new UserRepository()
  })
  beforeEach(async () => await clear())
  afterAll(async () => await close())

  it('should method returns a empty list', async () => {
    const result = await sut.list()
    expect(result.length).toBe(0)
  })

  it('should call find method of UserModel', async () => {
    const userModelFind = jest.spyOn(UserModel, 'find')
    await sut.list()
    expect(userModelFind).toHaveBeenCalledTimes(1)
    expect(userModelFind).toHaveBeenCalledWith({})
  })

  it('should method returns one result', async () => {
    const userData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      admin: false
    }
    await UserModel.create(userData)
    const result = await sut.list()
    expect(result.length).toBe(1)
    expect(result[0]).toHaveProperty('_id')
    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining(userData)])
    )
  })
})
