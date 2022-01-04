import { Router } from 'express'
import { HomeController, UserController } from '~/app/controllers'

const router = Router()

router.get('/', new HomeController().index)
router.get('/api/users', new UserController().index)

export default router
