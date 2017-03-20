'use strict'

require('dotenv').config({ silent: true })

const log = require('fancy-log')

require('./lib/server').listen(process.env.PORT, () => {
  log.info(`app started: http://localhost:${process.env.PORT}`)
})
