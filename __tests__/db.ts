import mongoose, { Collection } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer: MongoMemoryServer

export const connect = async () => {
  try {
    await mongoose.disconnect()
    mongoServer = await MongoMemoryServer.create()
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri)
  } catch (err) {
    console.log(err)
  }
}

export const close = async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
}

type CollectionList = {
  [index: string]: Collection
}

export const clear = async () => {
  const collections: CollectionList = mongoose.connection.collections
  for (const key in collections) {
    await collections[key].deleteMany({})
  }
}
