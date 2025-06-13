const express =  require('express')
const router = express.Router()
const controller = require('../controllers/signin')

router.route('/')
    .post(controller.signin)

module.exports = router

