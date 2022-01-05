import { UserRepository } from '~/app/repositories'
import { userList, userItem } from '~/app/dto'
import { UserValidation } from '~/app/validations/userValidation'

export class UserService {
  constructor(
    private readonly repository = new UserRepository(),
    private readonly validation = new UserValidation()
  ) {}

  async list() {
    const data = await this.repository.list()
    return userList(data)
  }

  async create(data: any) {
    await this.validation.validateStore(data)
    await this.repository.checkExists(data.email)
    const result = await this.repository.create(data)
    return userItem(result)
  }

  async findById(id: string) {
    this.validation.validateFindById(id)
    const result = await this.repository.findById(id)
    return userItem(result)
  }
}
