import { NextFunction, Request, Response } from 'express'
import jwt, { Secret } from 'jsonwebtoken'

interface DecodedToken {
  userId: string
}

export default function (req: Request, res: Response, next: NextFunction): void {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (token === undefined) throw new Error('The given token is undefined, authorization denied')
    const decodedToken: DecodedToken = jwt.verify(token, process.env.JWT_PRIVATE_KEY as Secret) as DecodedToken
    const userId = decodedToken.userId
    if (req.body.userId === true && req.body.userId !== userId) throw new Error('Invalid user ID')
    else next()
  } catch (error) {
    res.status(401).json({
      message: error ?? 'Authorization denied'
    })
  }
}
