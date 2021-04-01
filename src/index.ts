import express, { Application, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import mongoose, { CallbackError } from 'mongoose'

import indexRouter from './routes/index.route'
import authRouter from './routes/auth.route'

(() => {
  const app = express()
  setupConfiguration(app)
  setupMiddleware(app)
  setupRoutes(app)
  startApplication(app)
})()

function setupConfiguration (app: Application) {
  dotenv.config()
  const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true }
  const dbUrl = process.env.DB_URL?.toString() ?? 'null'
  mongoose.connect(dbUrl, dbOptions)
    .then(() => { console.log('💿 The application is connected to MongoDB Altas !') })
    .catch(error => { console.error(error) })
}

function setupMiddleware (app: Application) {
  app.use(express.json())
}

function setupRoutes (app: Application) {
  app.use('/', indexRouter)
  app.use('/api/auth', authRouter)
  app.use(manageError)
}

function manageError (error: Error | CallbackError, req: Request, res: Response, next: NextFunction) {
  console.log(error?.message)
  res.status(500).json({ message: error?.message })
}

function startApplication (app: Application) {
  const port = process.env.APP_PORT ?? 3000
  const message = `🚀 The application is launched on http://localhost:${port}`
  app.listen(port, () => { console.log(message) })
}
