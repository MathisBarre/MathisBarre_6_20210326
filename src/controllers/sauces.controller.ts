import { Response, Request, NextFunction } from 'express'
import Sauces from '../models/sauce.model'

export async function getAll (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sauces = await Sauces.find()
    res.json(sauces)
  } catch (error) {
    next(error)
  }
}

export async function createOne (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    console.log(req)
    throw new Error('foo')
    // res.json({ message: 'New sauce successfully added !' })
  } catch (error) {
    next(error)
  }
}
