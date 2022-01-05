import mongoose from 'mongoose'
import config from '~/config'

class Database {
  constructor() {
    this.initMongoDb()
  }

  async initMongoDb() {
    await mongoose.connect(config.mongoUrl).catch((err) => console.error(err))
  }
}

export default new Database()
