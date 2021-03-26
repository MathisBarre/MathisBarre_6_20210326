import { Router } from 'express'

export default Router()
  .get('/', (req, res) => { res.send('It works !') })
