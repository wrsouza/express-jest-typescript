import { UserRepository } from '~/app/repositories'
import { userList } from '~/app/dto'

export class UserService {
  constructor(private readonly repository = new UserRepository()) {}
  async list() {
    const data = await this.repository.list()
    return userList(data)
  }
}
