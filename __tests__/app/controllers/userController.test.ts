import { connect, clear, close } from '~/tests/db'
import server from '~/server'
import request from 'supertest'
import { UserModel } from '~/app/schemas'
import { UserRepository } from '~/app/repositories'

describe('User List Api', () => {
  beforeAll(async () => await connect())
  beforeEach(async () => await clear())
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

describe('User List Api', () => {
  beforeAll(async () => await connect())
  beforeEach(async () => await clear())
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
