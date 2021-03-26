import express from 'express'
import dotenv from 'dotenv'
dotenv.config()
const app = express()

app.get('/', (req, res) => {
  res.send('Hello world')
})

const port = process.env.port ?? 3000
app.listen(port, () => {
  console.log('🚀 The application is launched on https://localhost:3000, it is now ready to go to the moon !')
})
