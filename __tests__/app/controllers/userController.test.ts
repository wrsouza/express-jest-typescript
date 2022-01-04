import { connect, clear, close } from '~/tests/db'
import server from '~/server'
import request from 'supertest'
import { UserModel } from '~/app/schemas'

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
