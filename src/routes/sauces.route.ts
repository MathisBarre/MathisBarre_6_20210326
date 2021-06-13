/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express'
import multer from 'multer'
import auth from '../middleware/auth.middleware'
import { getAll, getOne, createOne, manageLike, updateSauce, deleteOne } from '../controllers/sauces.controller'

const upload = multer({
  storage: multer.diskStorage({
    destination: 'src/public/uploads/images/sauces',
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
})

export default Router()
  .get('/', auth, getAll)
  .get('/:id', auth, getOne)
  .post('/', auth, upload.single('image'), createOne)
  .post('/:id/like', auth, manageLike)
  .put('/:id', auth, upload.single('image'), updateSauce)
  .delete('/:id', auth, deleteOne)
