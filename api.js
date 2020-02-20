const path = require('path')
const service = require('restana')({
  errorHandler (err, req, res) {
    console.log(`Unexpected error: ${err.message}`)
    res.send(err)
  }
})
const swagger = require('swagger-tools')
const spec = require('./swagger.json')

const router = service.newRouter()
router.get('/nested-sync', (req, res) => {
  throw new Error('Nest Sync Handler error catched ?')
})
router.get('/nested-async', async (req, res) => {
  throw new Error('Nest Async Handler error catched ?')
})

swagger.initializeMiddleware(spec, async (middleware) => {
  service.use(middleware.swaggerMetadata())
  service.use(middleware.swaggerValidator())
  service.use(middleware.swaggerUi())

  service.get('/direct-sync', (req,res,next) => {
    throw new Error('Direct Sync Handler error catched ?')
  })

  service.get('/direct-async', async (req,res,next) => {
    throw new Error('Direct Async Handler error catched ?')
  })

  service.use('/', router)

  await service.start(4242)
  console.log('API documentation is now running at http://localhost:4242/docs/')
})