import { UserService } from '~/app/services'
import * as UserDto from '~/app/dto/users'
import { UserRepository } from '~/app/repositories'
import { UserValidation } from '~/app/validations'
import { connect, clear, close } from '~/tests/db'
import { ValidationError, AlreadyExistsError, NotFoundError } from '~/errors'
import { UserModel } from '~/app/schemas'

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

describe('UserService findById method', () => {
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
      await sut.findById('any_id')
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError)
    }
  })

  it('should throw NotFound Error', async () => {
    try {
      await sut.findById('61d3a1f6d06d93fde46a0fcd')
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError)
    }
  })

  it('should method returns a user', async () => {
    const data = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const user = await UserModel.create(data)
    const result = await sut.findById(user._id)
    expect(result).toEqual(
      expect.objectContaining({
        id: user._id,
        name: 'any_name',
        email: 'any_email',
        admin: false
      })
    )
  })
})

describe('UserService update method', () => {
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

  it('should throw Validation Error if i pass wrong data', async () => {
    // wrong id
    try {
      await sut.update('any_id', {})
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError)
    }
    // wrong email
    try {
      await sut.update('61d3a1f6d06d93fde46a0fcd', { email: 'any_email' })
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError)
    }
  })

  it('should throw NotFound if i pass wrong id', async () => {
    const userData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    jest
      .spyOn(UserValidation.prototype, 'validateUpdate')
      .mockImplementation(
        jest
          .fn()
          .mockImplementation(
            (userData: { name: string; email: string; password: string }) => {}
          )
      )
    try {
      await sut.update('61d3a1f6d06d93fde46a0fcd', userData)
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError)
    }
  })

  it('should return a user updated', async () => {
    const userData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const user = await UserModel.create(userData)
    const userUpdateData = {
      name: 'any_update_name',
      email: 'any_update_email',
      password: 'any_update_password'
    }
    jest
      .spyOn(UserValidation.prototype, 'validateUpdate')
      .mockImplementation(
        jest
          .fn()
          .mockImplementation(
            (userData: { name: string; email: string; password: string }) => {}
          )
      )
    const result = await sut.update(user._id.toString(), userUpdateData)
    expect(result).toEqual(
      expect.objectContaining({
        id: user._id,
        name: 'any_update_name',
        email: 'any_update_email'
      })
    )
  })
})

describe('UserService destroy method', () => {
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

  it('should throw Validation Error if i pass wrong data', async () => {
    try {
      await sut.destroy('any_id')
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError)
    }
  })

  it('should throw NotFound if i pass wrong id', async () => {
    try {
      await sut.destroy('61d3a1f6d06d93fde46a0fcd')
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError)
    }
  })

  it('should delete a user', async () => {
    const data = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const user = await UserModel.create(data)
    const result = await sut.destroy(user._id.toString())
    expect(result).toBe(undefined)

    try {
      await sut.findById(user._id.toString())
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError)
    }
  })
})
