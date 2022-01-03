import server from '~/server'
import request from 'supertest'

describe('HomeApi', () => {
  it('should home api return success data', async () => {
    const res = await request(server).get('/')
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body).toEqual({ message: 'Hello World' })
  })
})
