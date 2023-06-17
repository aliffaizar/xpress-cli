import { JsonObject } from 'swagger-ui-express'

const doc: JsonObject = {
  openapi: '3.0.0',
  info: {
    title: 'API',
    version: '0.0.0',
    description: 'API description',
  },
  produces: ['application/json'],

  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local server',
      consumers: ['application/json'],
    },
  ],
  paths: {
    '/': {
      get: {
        tags: ['Root'],
        summary: 'Get API status',
        description: 'Get API status',
        responses: {
          200: {
            description: 'OK',
          },
        },
      },
    },
  },
}

export default doc
