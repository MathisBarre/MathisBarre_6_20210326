/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import { getAll, createOne } from '../controllers/sauces.controller'

export default Router()
  .get('/', getAll)
  .post('/', createOne)
