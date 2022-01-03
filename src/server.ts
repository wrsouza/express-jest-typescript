import express, { Application, json } from 'express'
import routes from './routes'

const server: Application = express()
server.use(json())
server.use(routes)

export default server
