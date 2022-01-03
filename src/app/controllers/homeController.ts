import { Request, Response } from 'express'
import { HomeService } from '~/app/services'

export class HomeController {
  index(req: Request, res: Response) {
    const service = new HomeService()
    res.send(service.handler())
  }
}
