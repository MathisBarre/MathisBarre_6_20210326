import { Response, Request, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.model'

export function signup (req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body
  bcrypt.hash(password, 10, (error: Error, hash: string) => {
    if (error) next(error)

    User.create({ email, password: hash }, (error, user) => {
      if (error) next(error)
      res.json(user)
    })
  })
}

export function login (req: Request, res: Response) {

}
