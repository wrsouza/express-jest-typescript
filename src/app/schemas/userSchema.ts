import { Schema, model } from 'mongoose'

export interface User {
  name: string
  email: string
  password: string
  admin?: boolean
}

const schema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
)

export const UserModel = model<User>('User', schema)
