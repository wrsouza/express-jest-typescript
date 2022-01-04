import { Request, Response } from 'express'
import { UserService } from '~/app/services'

export class UserController {
  async index(req: Request, res: Response) {
    const service = new UserService()
    const result = await service.list()
    res.json(result)
  }
}
