import express, { Application, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import PrettyError from 'pretty-error'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'

import indexRouter from './routes/index.route'
import authRouter from './routes/auth.route'
import saucesRouter from './routes/sauces.route'

(() => {
  const app = express()
  setupConfiguration(app)
  setupMiddleware(app)
  setupRoutes(app)
  startApplication(app)
})()

function setupConfiguration (app: Application): void {
  dotenv.config()

  const prettyError = new PrettyError()
  prettyError.start()

  const dbOptions = { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  const dbUrl = process.env.DB_URL?.toString() ?? 'null'
  mongoose.connect(dbUrl, dbOptions)
    .then(() => { console.log('💿 The application is connected to MongoDB Altas !') })
    .catch(error => { console.error(error) })
}

function setupMiddleware (app: Application): void {
  app.use(cors())
  app.use(express.json())
  app.use(express.static(path.join(__dirname, 'public')))
}

function setupRoutes (app: Application): void {
  app.use('/', indexRouter)
  app.use('/api/auth', authRouter)
  app.use('/api/sauces', saucesRouter)
  app.use(manageError)
}

function manageError (error: Error | unknown, req: Request, res: Response, next: NextFunction): void {
  if (error instanceof Error && error.message.length > 0) {
    console.log(error)
    res.status(500).json({ message: 'ERROR : ' + error.message })
  } else {
    console.log(error)
    res.status(500).json({ message: 'An error has occured' })
  }
}

function startApplication (app: Application): void {
  const port = process.env.APP_PORT ?? 3000
  const message = `🚀 The application is launched on http://localhost:${port}`
  app.listen(port, () => { console.log(message) })
}
