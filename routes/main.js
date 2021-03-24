const express = require('express')
const router = express.Router()
const main = require('../controllers/main')
const {
  userAuth
} = require('../helpers/helpers')

router.get('', userAuth, main.index)
router.get('/login', main.login)
router.get('/logout', main.log_out)
router.post('/sign-up', main.sign_up)
router.post('/sign-in', main.sign_in)

module.exports = router