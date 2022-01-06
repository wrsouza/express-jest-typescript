import request from 'supertest'
import server from '~/server'
import { connect, clear, close } from '~/tests/db'
import { UserModel } from '~/app/schemas'
import { UserRepository } from '~/app/repositories'
import { NotFoundError, ValidationError } from '~/errors'

describe('User List Api', () => {
  beforeAll(async () => await connect())
  beforeEach(async () => {
    jest.clearAllMocks()
    await clear()
  })
  afterAll(async () => await close())

  it('should get /api/users and returns empty list', async () => {
    const res = await request(server).get('/api/users')
    expect(res.status).toBe(200)
    expect(res.body.length).toBe(0)
  })

  it('should get /api/users and returns list with one user', async () => {
    const userData = {
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      admin: false
    }
    await UserModel.create(userData)
    const res = await request(server).get('/api/users')
    expect(res.body.length).toBe(1)
    expect(res.body[0]).toHaveProperty('id')
    expect(res.body[0]).toHaveProperty('createdAt')
    expect(res.body[0]).not.toHaveProperty('password')
    expect(res.body).toEqual(
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

describe('User Store Api', () => {
  beforeAll(async () => await connect())
  beforeEach(async () => {
    jest.clearAllMocks()
    await clear()
  })
  afterAll(async () => await close())

  it('should post /api/users returns a new user', async () => {
    const data = {
      name: 'User Test',
      email: 'user@test.com',
      password: '123456'
    }
    const res = await request(server).post('/api/users').send(data)
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body).toEqual(
      expect.objectContaining({
        name: 'User Test',
        email: 'user@test.com'
      })
    )
  })

  it('should post /api/users returns Validation Error', async () => {
    const data = {}
    const res = await request(server).post('/api/users').send(data)
    expect(res.status).toBe(400)
    expect(res.body).toEqual(
      expect.objectContaining({
        name: ['Name is required'],
        email: ['Email is required'],
        password: ['Password is required']
      })
    )
  })

  it('should post /api/users returns Server Error', async () => {
    const data = {
      name: 'User Test',
      email: 'user@test.com',
      password: '123456'
    }
    jest
      .spyOn(UserRepository.prototype, 'create')
      .mockImplementation(
        async () => await Promise.reject(new Error('server error'))
      )
    const res = await request(server).post('/api/users').send(data)
    expect(res.status).toBe(500)
  })
})

describe('User Show Api', () => {
  beforeAll(async () => await connect())
  beforeEach(async () => {
    jest.clearAllMocks()
    await clear()
  })
  afterAll(async () => await close())

  it('should get /api/users/:id returns a user', async () => {
    const data = {
      name: 'User Test',
      email: 'user@test.com',
      password: '123456'
    }
    const user = await UserModel.create(data)
    const res = await request(server).get(`/api/users/${user._id}`)
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('id')
    expect(res.body).toEqual(
      expect.objectContaining({
        id: user._id.toString(),
        name: 'User Test',
        email: 'user@test.com'
      })
    )
  })

  it('should get /api/users/:id throw Validation Error', async () => {
    try {
      const id = 'any_id'
      await request(server).get(`/api/users/${id}`)
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError)
    }
  })

  it('should get /api/users/:id throw NotFound Error', async () => {
    try {
      const id = '61d3a1f6d06d93fde46a0fcd'
      await request(server).get(`/api/users/${id}`)
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError)
    }
  })
})

describe('User Update Api', () => {
  beforeAll(async () => await connect())
  beforeEach(async () => await clear())
  afterAll(async () => await close())

  it('should put /api/users/:id returns a updated user', async () => {
    const data = {
      name: 'User Test',
      email: 'user@test.com',
      password: '123456'
    }
    const user = await UserModel.create(data)
    const res = await request(server)
      .put(`/api/users/${user._id.toString()}`)
      .send(data)
    expect(res.status).toBe(200)
    expect(res.body).toEqual(
      expect.objectContaining({
        id: user._id.toString(),
        name: 'User Test',
        email: 'user@test.com',
        admin: false
      })
    )
  })

  it('should put /api/users/:id returns Validation Error if i pass wrong data', async () => {
    const data = {}
    const res = await request(server).put('/api/users/any_id').send(data)
    expect(res.status).toBe(400)
    expect(res.body).toEqual(
      expect.objectContaining({
        id: ['User Id invalid']
      })
    )
    const result = await request(server)
      .put('/api/users/61d3a1f6d06d93fde46a0fcd')
      .send({ email: 'any_email' })
    expect(res.status).toBe(400)
    expect(result.body).toEqual(
      expect.objectContaining({
        email: ['Invalid Email']
      })
    )
  })

  it('should put /api/users/:id throw NotFoundError', async () => {
    const data = {
      name: 'User Test',
      email: 'user@test.com',
      password: '123456'
    }
    try {
      await request(server)
        .put('/api/users/61d3a1f6d06d93fde46a0fcd')
        .send(data)
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundError)
    }
  })

  it('should put /api/users/:id returns Server Error', async () => {
    const data = {
      name: 'User Test',
      email: 'user@test.com',
      password: '123456'
    }
    const user = await UserModel.create(data)
    jest
      .spyOn(UserRepository.prototype, 'update')
      .mockImplementation(
        async () => await Promise.reject(new Error('server error'))
      )
    const res = await request(server)
      .put(`/api/users/${user._id.toString()}`)
      .send(data)
    expect(res.status).toBe(500)
  })
})

describe('User Delete Api', () => {
  beforeAll(async () => await connect())
  beforeEach(async () => await clear())
  afterAll(async () => await close())

  it('should delete /api/users/:id returns Validation Error if i pass wrong id', async () => {
    const res = await request(server).delete('/api/users/any_id')
    expect(res.status).toBe(400)
    expect(res.body).toEqual(
      expect.objectContaining({
        id: ['User Id invalid']
      })
    )
  })

  it('should delete /api/users/:id returns statusCode 404 Not Found', async () => {
    const res = await request(server).delete(
      '/api/users/61d3a1f6d06d93fde46a0fcd'
    )
    expect(res.status).toBe(404)
  })

  it('should delete /api/users/:id returns statusCode 204 No Content', async () => {
    const data = {
      name: 'User Test',
      email: 'user@test.com',
      password: '123456'
    }
    const user = await UserModel.create(data)
    const res = await request(server).delete(
      `/api/users/${user._id.toString()}`
    )
    expect(res.status).toBe(204)
  })

  it('should delete /api/users/:id returns Server Error', async () => {
    const data = {
      name: 'User Test',
      email: 'user@test.com',
      password: '123456'
    }
    const user = await UserModel.create(data)
    jest
      .spyOn(UserRepository.prototype, 'destroy')
      .mockImplementation(
        async () => await Promise.reject(new Error('server error'))
      )
    const res = await request(server).delete(
      `/api/users/${user._id.toString()}`
    )
    expect(res.status).toBe(500)
  })
})
