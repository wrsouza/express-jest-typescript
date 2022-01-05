import { UserModel, User } from '~/app/schemas'
import { AlreadyExistsError, NotFoundError } from '~/errors'
import { hashSync } from 'bcryptjs'

export class UserRepository {
  constructor(private readonly model = UserModel) {}

  async list() {
    return await this.model.find({})
  }

  async create(data: User) {
    const { name, email, password } = data
    return await this.model.create({
      name,
      email,
      password: hashSync(password, 8)
    })
  }

  async checkExists(email: string) {
    const user = await this.model.findOne({ email })
    if (user) {
      throw new AlreadyExistsError('email', 'Email already exists')
    }
  }

  async findById(id: string) {
    const user = await this.model.findById(id)
    if (!user) {
      throw new NotFoundError('User not exists')
    }
    return user
  }
}
