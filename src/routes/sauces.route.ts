/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import multer from 'multer'
import { getAll, createOne } from '../controllers/sauces.controller'

const upload = multer({ dest: 'upload/' })

export default Router()
  .get('/', getAll)
  .post('/', upload.single('image'), createOne)
