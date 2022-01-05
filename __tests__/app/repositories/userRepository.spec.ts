import bcrypt from 'bcryptjs'
import { Document } from 'mongoose'
import { connect, clear, close } from '~/tests/db'
import { UserRepository } from '~/app/repositories'
import { UserModel } from '~/app/schemas'
import { AlreadyExistsError, NotFoundError } from '~/errors'

describe('UserRepository list method', () => {
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

  it('should list method call find method of UserModel', async () => {
    const userModelFind = jest.spyOn(UserModel, 'find')
    await sut.list()
    expect(userModelFind).toHaveBeenCalledTimes(1)
    expect(userModelFind).toHaveBeenCalledWith({})
  })

  it('should list method returns one result', async () => {
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

describe('UserRepository create method', () => {
  let sut: UserRepository

  beforeAll(async () => {
    await connect()
    sut = new UserRepository()
  })
  beforeEach(async () => await clear())
  afterAll(async () => await close())

  it('should method returns a new user', async () => {
    const userData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const userModelCreate = jest.spyOn(UserModel, 'create')
    const hashSync = jest
      .spyOn(bcrypt, 'hashSync')
      .mockReturnValue('any_hash_password')
    const result = await sut.create(userData)
    expect(hashSync).toHaveBeenCalledTimes(1)
    expect(hashSync).toHaveBeenCalledWith('any_password', 8)
    expect(userModelCreate).toHaveBeenCalledTimes(1)
    expect(userModelCreate).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email',
      password: 'any_hash_password'
    })
    expect(result).toHaveProperty('_id')
    expect(result).toEqual(
      expect.objectContaining({
        name: 'any_name',
        email: 'any_email',
        password: 'any_hash_password'
      })
    )
  })
})

describe('UserRepository checkExists method', () => {
  let sut: UserRepository

  beforeAll(async () => {
    await connect()
    sut = new UserRepository()
  })
  beforeEach(async () => await clear())
  afterAll(async () => await close())

  it('should method returns void if user not exists', async () => {
    const email = 'any_email'
    const userModelFindOne = jest.spyOn(UserModel, 'findOne')
    const result = await sut.checkExists(email)
    expect(userModelFindOne).toHaveBeenCalledTimes(1)
    expect(userModelFindOne).toHaveBeenCalledWith({ email })
    expect(result).toBeUndefined()
  })

  it('should method returns AlreadyExistsError if user exists', async () => {
    await UserModel.create({
      name: 'any_name',
      email: 'any_email',
      password: 'any_hash_password'
    })
    try {
      await sut.checkExists('any_email')
    } catch (err) {
      expect(err).toBeInstanceOf(AlreadyExistsError)
    }
  })
})

describe('UserRepository findById', () => {
  let sut: UserRepository

  beforeAll(async () => {
    await connect()
    sut = new UserRepository()
  })
  beforeEach(async () => {
    jest.clearAllMocks()
    await clear()
  })
  afterAll(async () => await close())

  it('should method returns NotFoundError', async () => {
    try {
      await sut.findById('61d3a1f6d06d93fde46a0fcd')
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError)
    }
  })

  it('shoud method return a user', async () => {
    const data = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password'
    }
    const user = await UserModel.create(data)
    const result = await sut.findById(user._id)
    expect(result).toBeInstanceOf(Document)
    expect(result.toJSON()).toEqual(expect.objectContaining(data))
  })

  it('should method returns generic Error', async () => {
    try {
      await sut.findById('any_id')
    } catch (err) {
      expect(err).toBeInstanceOf(Error)
    }
  })
})
