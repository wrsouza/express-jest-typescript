import { Document, ObjectId } from 'mongoose'
import { User } from '~/app/schemas'

interface UserData {
  _id: ObjectId
  createdAt?: boolean | string
  updatedAt?: boolean | string
}

export const userList = (
  data: (Document<any, any, User> & User & UserData)[]
) => {
  return data.map((i) => ({
    id: i._id,
    name: i.name,
    email: i.email,
    admin: i.admin,
    createdAt: i.createdAt
  }))
}

export const userItem = (data: Document<any, any, User> & User & UserData) => {
  const { _id: id, name, email, admin, createdAt } = data
  return {
    id,
    name,
    email,
    admin,
    createdAt
  }
}
