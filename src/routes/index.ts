import { Request, Response, Router, NextFunction } from 'express'
import { HomeController, UserController } from '~/app/controllers'

const router = Router()

const use = (fn: any) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next)

router.get('/', use(new HomeController().index))
router.get('/api/users', use(new UserController().index))
router.post('/api/users', use(new UserController().store))
router.get('/api/users/:id', use(new UserController().show))

export default router
