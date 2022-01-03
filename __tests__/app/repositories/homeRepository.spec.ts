import { HomeRepository } from '~/app/repositories'

describe('HomeRepository', () => {
  let sut: HomeRepository

  beforeEach(() => {
    sut = new HomeRepository()
  })

  it('should call HomeRepository when HomeService returns data', () => {
    const res = sut.getMessage()
    expect(res).toHaveProperty('message')
    expect(res).toEqual({ message: 'Hello World' })
  })
})
