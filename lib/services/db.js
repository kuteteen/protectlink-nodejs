'use strict'

const db = require('../database')

exports.get = key => {
  return new Promise((resolve, reject) => {
    db.get(key, (err, val) => {
      if (err) reject()

      resolve(val)
    })
  })
}
