import { app } from './app'
import { PORT } from './configs/env-config'

async function start() {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
  })
}

start()
