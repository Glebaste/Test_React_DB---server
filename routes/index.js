import {Router} from 'express'
import {router as deviceRouter} from './deviceRouter.js'
import {router as userRouter} from './userRouter.js'
import {router as brandRouter} from './brandRouter.js'
import {router as typeRouter} from './typeRouter.js'

const router = new Router()

router.use('/user', userRouter)
router.use('/type', typeRouter)
router.use('/brand', brandRouter)
router.use('/device', deviceRouter)

export {router}