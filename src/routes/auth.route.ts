/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { signup, login } from '../controllers/auth.controller'

export default Router()
  .post('/signup', signup)
  .post('/login', login)
