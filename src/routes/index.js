const express = require('express')
const router = express.Router()

const authRouter = require('./auth')
const uploadRouter = require('./upload')
const cors = require('../middleware/cors')

router.use(cors)

router.get('/', (req, res) => {
    res.status(401).json({
        status: 0,
        message: 'Unauthorized Access'
    })
})

router.use('/public', express.static('public'))
router.use('/auth', authRouter)
router.use('/upload', uploadRouter)

module.exports = router