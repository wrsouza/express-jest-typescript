import { Request, Response } from 'express'
import { UserService } from '~/app/services'

const service = new UserService()

export class UserController {
  async index(req: Request, res: Response) {
    const result = await service.list()
    res.send(result)
  }

  async store(req: Request, res: Response) {
    const result = await service.create(req.body)
    res.status(201)
    res.send(result)
  }

  async show(req: Request, res: Response) {
    const { id } = req.params
    const result = await service.findById(id)
    res.send(result)
  }
}
