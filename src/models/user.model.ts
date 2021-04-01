import { Schema, model, Document, Model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export interface Iuser extends Document {
  userId: string,
  email: string,
  password: string
}

const userSchema = new Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator)

const User: Model<Iuser> = model('User', userSchema)

export default User
