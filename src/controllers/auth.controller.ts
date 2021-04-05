import { Response, Request, NextFunction } from 'express'
import bcrypt from 'bcrypt'
import User from '../models/user.model'

export async function signup (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const email: string = req.body.email
    const password: string = req.body.password
    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ email, password: hashedPassword })
    res.json(newUser)
  } catch (error) {
    next(error)
  }
}

export async function login (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const emailInRequest: string = req.body.email
    const passwordInRequest: string = req.body.password

    const userInDB = await User.findOne({ email: emailInRequest })

    if (userInDB === null || userInDB.password === null) {
      res.status(401).json({
        message: 'Access denied : no account is linked to this email address',
        message_FR: 'Accès réfusé : aucun compte n\'est lié à cette adresse e-mail'
      })
      return
    }

    const hashedPasswordInDB = userInDB.password
    const thePasswordsMatch = await bcrypt.compare(passwordInRequest, hashedPasswordInDB)

    if (thePasswordsMatch) {
      res.json({
        message: 'Access allowed',
        jwtToken: 's57df5qs7dfqsdf57qsdf.6qsd7fqs87df8sq7df8'
      })
    } else {
      res.status(401).json({
        message: 'Access denied : bad password',
        message_FR: 'Accès refusé : mauvais mot de passe'
      })
    }
  } catch (error) {
    next(error)
  }
}
