import { Router } from 'express'
import { signup, login } from '../controllers/auth.controller'

export default Router()
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .post('/signup', signup)
  .post('/login', login)
