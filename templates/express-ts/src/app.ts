import express from 'express'
import swaggerUi from 'swagger-ui-express'

import docs from './docs'
import { router } from './routes'
import { NotFoundError } from './libs/errors/not-found-error'
import { errorHandler } from './middlewares/error-handler'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', router)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(docs))

app.all('*', async (req, res, next) => {
  next(new NotFoundError('Route not found'))
})
app.use(errorHandler)

export { app }
