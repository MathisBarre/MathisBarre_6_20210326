import express, { Application } from 'express'
import dotenv from 'dotenv'
import indexRouter from './routes/index.route'
import debug from 'debug'

(() => {
  const app = express()
  setupConfiguration(app)
  setupMiddleware(app)
  setupRoutes(app)
  startApplication(app)
})()

function setupConfiguration (app: Application) {
  dotenv.config()
}

function setupMiddleware (app: Application) {
}

function setupRoutes (app: Application) {
  app.use('/', indexRouter)
}

function startApplication (app: Application) {
  const port = process.env.APP_PORT ?? 3000
  const message = `🚀 The application is launched on http://localhost:${port}`
  app.listen(port, () => { console.log(message) })
}
