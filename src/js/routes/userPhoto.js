
const express =  require('express')
const router = express.Router()
const controller = require('../controllers/userPhoto')


router.route('/me')
    .get(controller.getPhoto)

module.exports = router

