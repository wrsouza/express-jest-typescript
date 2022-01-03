import { Router } from 'express'
import { HomeController } from '~/app/controllers'

const router = Router()

router.get('/', new HomeController().index)

export default router
