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
    const sauceInRequest = JSON.parse(req.body.sauce)
    const newlyUploadedImagePath = req.file.path
    const backendBaseUrl = `${req.protocol}://${req.get('host') ?? ''}`

    await Sauces.create({
      userId: sauceInRequest.userId,
      name: sauceInRequest.name,
      manufacturer: sauceInRequest.manufacturer,
      description: sauceInRequest.description,
      mainPepper: sauceInRequest.mainPepper,
      imageUrl: backendBaseUrl + '/' + newlyUploadedImagePath,
      heat: sauceInRequest.heat
    })

    res.json({ message: 'New sauce successfully created !' })
  } catch (error) {
    next(error)
  }
}
