import { Response, Request, NextFunction } from 'express'
import Sauces from '../models/sauce.model'
import path from 'path'

export async function getAll (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sauces = await Sauces.find()
    res.json(sauces)
  } catch (error) {
    next(error)
  }
}

export async function getOne (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sauceIdInRequest = req.params.id
    const sauceToReturn = await Sauces.findOne({ _id: sauceIdInRequest })
    if (sauceToReturn === null) throw new Error('There is no existing sauce with this id')
    res.json(sauceToReturn)
  } catch (error) {
    next(error)
  }
}

export async function createOne (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sauceInRequest = JSON.parse(req.body.sauce)
    const newlyUploadedImagePath = path.join(req.file.destination, req.file.filename).replace('src\\public', '')
    const backendBaseUrl = `${req.protocol}://${req.get('host') ?? ''}`
    console.log(newlyUploadedImagePath)

    await Sauces.create({
      userId: sauceInRequest.userId,
      name: sauceInRequest.name,
      manufacturer: sauceInRequest.manufacturer,
      description: sauceInRequest.description,
      mainPepper: sauceInRequest.mainPepper,
      imageUrl: path.join(backendBaseUrl, newlyUploadedImagePath).replace('/\\/g', '/'),
      heat: sauceInRequest.heat
    })

    res.json({ message: 'New sauce successfully created !' })
  } catch (error) {
    next(error)
  }
}

export async function deleteOne (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sauceIdInRequest = req.params.id
    const deletionResult = await Sauces.deleteOne({ _id: sauceIdInRequest })
    if (deletionResult.deletedCount === 0) throw new Error('There is no existing sauce to delete with this id')
    res.json({ message: `Sauce with id ${sauceIdInRequest} has been deleted` })
  } catch (error) {
    next(error)
  }
}
