import { HomeService } from '~/app/services'
import { HomeRepository } from '~/app/repositories'

describe('HomeService', () => {
  let sut: HomeService

  beforeEach(() => {
    sut = new HomeService()
  })

  it('should call HomeRepository when HomeService returns data', () => {
    jest
      .spyOn(HomeRepository.prototype, 'getMessage')
      .mockImplementation(() => ({ message: 'any_message' }))
    const res = sut.handler()
    expect(res).toHaveProperty('message')
    expect(res).toEqual({ message: 'any_message' })
  })
})
