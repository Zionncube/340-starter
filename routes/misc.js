// routes/misc.js
const express = require('express')
const router = express.Router()

router.get('/cause-error', (req, res, next) => {
  // create a real error to test middleware
  const err = new Error('Intentional 500 error for testing')
  err.status = 500
  next(err)
})

module.exports = router
