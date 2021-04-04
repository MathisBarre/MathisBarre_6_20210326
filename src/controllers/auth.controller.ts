import { Response, Request, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.model'

export async function signup (req: Request, res: Response, next: NextFunction) {
  try {
    const email: string = req.body.email
    const password: string = req.body.password
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ email, password: hashedPassword })
    if (newUser) res.json(newUser)
  } catch (error) {
    next(error)
  }
}

export function login (req: Request, res: Response) {

}
