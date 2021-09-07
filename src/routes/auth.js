const router = require('express').Router()
const controller = require('../controllers/auth')

router.post('/login', controller.login)

router.post('/register', controller.register)

router.get('/user', controller.user)

router.get('/uploads', controller.uploads)

router.get('/uploads/all', controller.allUploads)

module.exports = router