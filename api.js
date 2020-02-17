const path = require('path')
const service = require('restana')({
  errorHandler (err, req, res) {
    console.log(`Unexpected error: ${err.message}`)
    res.send(err)
  }
})
const swagger = require('swagger-tools')
const spec = require('./swagger.json')

swagger.initializeMiddleware(spec, async (middleware) => {
  service.use(middleware.swaggerMetadata())
  service.use(middleware.swaggerValidator())
  service.use(middleware.swaggerUi())
  service.use(middleware.swaggerRouter({
    controllers: path.join(__dirname, '/controllers')
  }))

  service.use(async (req, res, next) => {
    try {
      await next()
    } catch (err) {
      console.log('upps, something just happened')
      res.send(err)
    }
  })

  await service.start(4242)
  console.log('API documentation is now running at http://localhost:4242/docs/')
})