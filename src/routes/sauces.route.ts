/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import multer from 'multer'
import { getAll, getOne, createOne, deleteOne } from '../controllers/sauces.controller'

const upload = multer({
  storage: multer.diskStorage({
    destination: 'src/public/uploads/images/sauces',
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
})

export default Router()
  .get('/', getAll)
  .get('/:id', getOne)
  .post('/', upload.single('image'), createOne)
  .delete('/:id', deleteOne)
