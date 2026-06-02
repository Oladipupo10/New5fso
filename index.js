
const app = require('./app')
const http = require('http')
const config = require('./utils/config')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const { error } = require('console')
mongoose.set('strictQuery', false)
logger.info('Connecting')
const server = http.createServer(app)
server.listen(config.PORT, () => { 
logger.info(`Server running on port ${config.PORT}`)
})
mongoose.connect(config.MONGODB_URI)
.then(() => {
  logger.info('connected to MongoDB')
})
.catch((error) => {
  logger.error('error connecting to MongoDb:',error.message)
})