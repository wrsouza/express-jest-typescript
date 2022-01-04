import { UserModel } from '~/app/schemas'

export class UserRepository {
  constructor(private readonly model = UserModel) {}

  async list() {
    return await this.model.find({})
  }
}
