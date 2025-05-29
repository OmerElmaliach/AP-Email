const express =  require('express')
const router = express.Router()
const controller = require('../controllers/users')

router.route('/')
    .post(controller.createUser)
    //FOR DEBUGGING- TO BE REMOVED******************** yo uses enter in bash: curl -X GET http://localhost:9000/api/users
    .get(controller.getAllUsers)

router.route('/:id')
    .get(controller.getUser)

module.exports = router

