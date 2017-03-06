'use strict'

require('dotenv').config({ silent: true })

require('./lib/server').listen(process.env.PORT, () => {
  console.log(`App started on port: ${process.env.PORT}`)
})
