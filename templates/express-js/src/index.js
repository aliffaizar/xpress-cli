const { app } = require('./app')
const { PORT } = require('./configs/env-config')

async function server() {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

server()
