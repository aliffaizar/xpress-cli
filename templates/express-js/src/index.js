import express from 'express'

import { errorMiddleware } from './middlewares/error-middleware.js'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Error handler middleware
app.use(errorMiddleware)

app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
