import { HomeRepository } from '~/app/repositories'

export class HomeService {
  constructor(
    private readonly repository: HomeRepository = new HomeRepository()
  ) {}

  handler() {
    return this.repository.getMessage()
  }
}
