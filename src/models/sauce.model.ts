import { Schema, model, Document, Model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export interface Isauce extends Document {
  _id?: string
  userId: string
  name: string
  manufacturer: string
  description: string
  mainPepper: string
  imageUrl: string
  heat: number
  likes?: number
  dislikes?: number
  usersLiked?: string[]
  usersDisliked?: string[]
}

const sauceSchema = new Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true, default: 0 },
  dislikes: { type: Number, required: true, default: 0 },
  usersLiked: [{ type: String, required: true, default: [] }],
  usersDisliked: [{ type: String, required: true, default: [] }]
})

sauceSchema.plugin(uniqueValidator)

const Sauce: Model<Isauce> = model('Sauce', sauceSchema)

export default Sauce
