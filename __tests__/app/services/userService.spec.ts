import { UserService } from '~/app/services'
import * as UserDto from '~/app/dto/users'
import { UserRepository } from '~/app/repositories'

describe('UserService', () => {
  let sut: UserService

  beforeAll(() => {})

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
