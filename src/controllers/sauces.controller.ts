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
    const userId = req.body.userId

    const sauce = await Sauces.findById(sauceId)
    if (sauce === null) throw new Error("The sauce id that you to update doesn't exist")

    let funcResponse
    if (likeState === 'dislike') {
      funcResponse = await saveThatUserDontLikeTheSauce(sauceId, userId, sauce)
    } else if (likeState === 'neutral') {
      funcResponse = await saveThatUserDontCareAboutTheSauce(sauceId, userId, sauce)
    } else if (likeState === 'like') {
      funcResponse = await saveThatUserLoveTheSauce(sauceId, userId, sauce)
    }

    const modifiedSauce = funcResponse?.modifiedSauce
    if (modifiedSauce === undefined) throw new Error('Sauce like or dislike failed, modifiedSauce is undefined')
    const messageStatus = funcResponse?.messageStatus
    await modifiedSauce.save()

    res.json({ message: 'The like has been processed successfully' })
  } catch (error) {
    next(error)
  }
}

async function saveThatUserDontLikeTheSauce (sauceId: string, userId: string, sauce: Isauce): Promise<{messageStatus: string, modifiedSauce: Isauce}> {
  let messageStatus = ''

  const likerIndex = sauce.usersLiked.indexOf(sauceId)
  const userActuallyLikeTheSauce = likerIndex > -1
  if (userActuallyLikeTheSauce) {
    sauce.usersLiked.splice(likerIndex, 1)
    sauce.likes -= 1
    messageStatus += 'Remove old like. '
  }

  const userActuallyDislikeSauce = sauce.usersDisliked.includes(userId)
  if (!userActuallyDislikeSauce) {
    sauce.usersLiked.push(userId)
    sauce.dislikes++
    messageStatus += 'Add new dislike. '
  }

  return { messageStatus: messageStatus, modifiedSauce: sauce }
}

async function saveThatUserDontCareAboutTheSauce (sauceId: string, userId: string, sauce: Isauce): Promise<{messageStatus: string, modifiedSauce: Isauce}> {
  let messageStatus = ''

  const dislikerIndex = sauce.usersDisliked.indexOf(sauceId)
  const userActuallyDislikeSauce = dislikerIndex > -1
  if (userActuallyDislikeSauce) {
    sauce.usersDisliked.splice(dislikerIndex, 1)
    sauce.dislikes -= 1
    messageStatus += 'Remove old dislike. '
  }

  const loverIndex = sauce.usersLiked.indexOf(sauceId)
  const userActuallyLikeTheSauce = loverIndex > -1
  if (userActuallyLikeTheSauce) {
    sauce.usersLiked.splice(loverIndex, 1)
    sauce.likes -= 1
    messageStatus += 'Remove old like. '
  }

  return { messageStatus: messageStatus, modifiedSauce: sauce }
}

async function saveThatUserLoveTheSauce (sauceId: string, userId: string, sauce: Isauce): Promise<{messageStatus: string, modifiedSauce: Isauce}> {
  let messageStatus = ''

  const dislikersIndex = sauce.usersDisliked.indexOf(sauceId)
  const userActuallyDislikeSauce = dislikersIndex > -1
  if (userActuallyDislikeSauce) {
    sauce.usersDisliked.splice(dislikersIndex, 1)
    sauce.likes -= 1
    messageStatus += 'Remove old dislike. '
  }

  const userActuallyLikeTheSauce = sauce.usersLiked.includes(userId)
  if (!userActuallyLikeTheSauce) {
    sauce.usersLiked.push(userId)
    sauce.likes++
    messageStatus += 'Add new like. '
  }

  return { messageStatus: messageStatus, modifiedSauce: sauce }
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
