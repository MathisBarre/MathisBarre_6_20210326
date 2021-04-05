import { Schema, model, Document, Model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export interface Iuser extends Document {
  _id: string
  email: string
  password: string
}

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator)

const User: Model<Iuser> = model('User', userSchema)

export default User
