import { Response, Request, NextFunction } from 'express'
import Sauces, { Isauce } from '../models/sauce.model'

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
    const newlyUploadedImagePath = 'http://localhost:3000/uploads/images/sauces/' + req.file.filename

    await Sauces.create({
      userId: sauceInRequest.userId,
      name: sauceInRequest.name,
      manufacturer: sauceInRequest.manufacturer,
      description: sauceInRequest.description,
      mainPepper: sauceInRequest.mainPepper,
      imageUrl: newlyUploadedImagePath,
      heat: sauceInRequest.heat
    })

    res.json({ message: 'New sauce successfully created !' })
  } catch (error) {
    next(error)
  }
}

export async function manageLike (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const likeState = { '-1': 'dislike', 0: 'neutral', 1: 'like' }[req.body.like as -1 | 0 | 1]
    const sauceId = req.params.id
    const userId: string = req.body.userId

    const sauce = await Sauces.findById(sauceId)
    if (sauce === null) throw new Error("The sauce id that you to update doesn't exist")

    const userLikeTheSauce = likeState === 'like'
    const userDontLikeTheSauce = likeState === 'dislike'
    const userDontCareAboutTheSauce = likeState === 'neutral'

    let message: string = 'Nothing as been done'
    if (userLikeTheSauce) message = await addLike(sauce, userId)
    else if (userDontLikeTheSauce) message = await addDislike(sauce, userId)
    else if (userDontCareAboutTheSauce) message = await removeUserFromLikeAndDislike(sauce, userId)
    else { throw new Error('Nothing has been done') }

    res.json({ message: message })
  } catch (error) {
    next(error)
  }
}

async function addLike (sauce: Isauce, userId: string): Promise<string> {
  const userAlreadyLikeTheSauce = sauce.usersLiked.find((element) => element === userId) !== undefined

  if (!userAlreadyLikeTheSauce) {
    sauce.usersLiked.push(userId)
    sauce.likes++
    await sauce.save()
    return 'Like has been added'
  }

  return 'The user already like the sauce'
}

async function addDislike (sauce: Isauce, userId: string): Promise<string> {
  const userAlreadyDislikeTheSauce = sauce.usersDisliked.find((element) => element === userId) !== undefined

  if (!userAlreadyDislikeTheSauce) {
    sauce.usersDisliked.push(userId)
    sauce.dislikes++
    await sauce.save()
    return 'Dislike has been added'
  }

  return 'The user already dislike the sauce'
}

async function removeUserFromLikeAndDislike (sauce: Isauce, userId: string): Promise<string> {
  const loverIndex = sauce.usersLiked.indexOf(userId)
  const userLikeTheSauce = loverIndex !== -1
  const haterIndex = sauce.usersDisliked.indexOf(userId)
  const userDislikeTheSauce = haterIndex !== -1

  if (userLikeTheSauce) {
    sauce.likes--
    sauce.usersLiked.splice(loverIndex, 1)
    await sauce.save()
    return 'A like as been removed'
  }

  if (userDislikeTheSauce) {
    sauce.dislikes--
    sauce.usersDisliked.splice(haterIndex, 1)
    await sauce.save()
    return 'A dislike as been removed'
  }

  return 'There was no like or dislike to remove, nothing as been done'
}

export async function updateSauce (req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const sauceId = req.params.id
    const sauceInRequest = (req.body.sauce !== undefined) ? JSON.parse(req.body.sauce) : req.body
    const newlyUploadedImagePath = (req.file !== undefined) ? `http://localhost:3000/uploads/images/sauces/${req.file.filename}` : null

    if (newlyUploadedImagePath !== null) sauceInRequest.imageUrl = newlyUploadedImagePath

    const sauce = await Sauces.findById(sauceId)
    if (sauce === null) throw new Error('Ther is no sauces with the given id')

    sauce.name = sauceInRequest.name
    sauce.manufacturer = sauceInRequest.manufacturer
    sauce.description = sauceInRequest.description
    sauce.mainPepper = sauceInRequest.mainPepper
    sauce.heat = sauceInRequest.heat
    sauce.userId = sauceInRequest.userId
    if (newlyUploadedImagePath !== null) sauce.imageUrl = newlyUploadedImagePath

    await sauce.save()

    res.json({ message: 'Sauce successfully updated !' })
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
