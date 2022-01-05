import { UserService } from '~/app/services'
import * as UserDto from '~/app/dto/users'
import { UserRepository } from '~/app/repositories'
import { UserValidation } from '~/app/validations'
import { connect, clear, close } from '~/tests/db'
import { ValidationError, AlreadyExistsError } from '~/errors'

describe('UserService list method', () => {
  let sut: UserService

  beforeEach(() => {
    sut = new UserService()
  })

  it('should call UserRepository and UserList', async () => {
    const userData = { any: 'any' }
    const userRepositorySpy = jest.spyOn(UserRepository.prototype, 'list')
    userRepositorySpy.mockImplementation(
      jest.fn().mockReturnValue(Promise.resolve([userData]))
    )
    const userListSpy = jest.spyOn(UserDto, 'userList')
    userListSpy.mockImplementation(
      jest.fn().mockImplementation((data: { any: string }[]) => data)
    )
    const result = await sut.list()
    expect(userRepositorySpy).toHaveBeenCalledTimes(1)
    expect(userListSpy).toHaveBeenCalledWith([userData])
    expect(userListSpy).toHaveBeenCalledTimes(1)
    expect(result).toEqual(
      expect.arrayContaining([expect.objectContaining(userData)])
    )
  })
})

describe('UserService create method', () => {
  let sut: UserService

  beforeAll(async () => {
    await connect()
    sut = new UserService()
  })
  beforeEach(async () => {
    jest.clearAllMocks()
    await clear()
  })
  afterAll(async () => await close())

  it('should throw Validation Error', async () => {
    try {
      await sut.create({})
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError)
    }
  })

  it('should throw AlreadyExistsError', async () => {
    const userData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    jest
      .spyOn(UserValidation.prototype, 'validateStore')
      .mockImplementation(
        jest
          .fn()
          .mockImplementation(
            (userData: { name: string; email: string; password: string }) => {}
          )
      )
    jest
      .spyOn(UserRepository.prototype, 'checkExists')
      .mockReturnValueOnce(
        Promise.reject(new AlreadyExistsError('email', 'Email already exists'))
      )
    try {
      await sut.create(userData)
    } catch (err) {
      expect(err).toBeInstanceOf(AlreadyExistsError)
    }
  })

  it('should return success data in create method', async () => {
    const userData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const userRepositorySpy = jest.spyOn(UserRepository.prototype, 'create')
    const userValidationSpy = jest
      .spyOn(UserValidation.prototype, 'validateStore')
      .mockImplementation(
        jest
          .fn()
          .mockImplementation(
            (userData: { name: string; email: string; password: string }) => {}
          )
      )
    const result = await sut.create(userData)
    expect(userValidationSpy).toHaveBeenCalledTimes(1)
    expect(userValidationSpy).toHaveBeenCalledWith(userData)
    expect(userRepositorySpy).toHaveBeenCalledTimes(1)
    expect(userRepositorySpy).toHaveBeenCalledWith(userData)
    expect(result).toHaveProperty('id')
    expect(result).toEqual(
      expect.objectContaining({
        name: 'any_name',
        email: 'any_email'
      })
    )
  })
})
