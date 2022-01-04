require('dotenv').config()

export default {
  mongoUrl: process.env.MONGO_URL || `mongodb://localhost:27017/test`
}
