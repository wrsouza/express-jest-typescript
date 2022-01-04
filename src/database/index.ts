import mongoose from 'mongoose'
import config from '~/config'

class Database {
  constructor() {
    this.initMongoDb()
  }

  async initMongoDb() {
    mongoose
      .connect(config.mongoUrl)
      .then(() => console.log('Database connected!'))
      .catch((err) => console.log(err))
  }
}

export default new Database()
