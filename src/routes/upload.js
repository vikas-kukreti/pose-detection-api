const router = require('express').Router()
const controller = require('../controllers/upload')

router.post('/image', controller.image)

module.exports = router