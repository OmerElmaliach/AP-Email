const express =  require('express')
const router = express.Router()
const controller = require('../controllers/users')
const multer = require('multer')
const path = require('path')
const { isLoggedIn } = require('../middleware/auth');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
       cb(null, path.join(__dirname, '../models/userPhoto'))
    },
    filename: function(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // Get the file ext
        const ext = path.extname(file.originalname)
        cb(null, uniqueSuffix + ext); // Filename
    }
})

// adding a filter that photo smaller then 5 mb
const fileFilter = (req,file,cb)=>{
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)){
        cb(null,true) //good pic
    }else{ // bad type return err
        cb(new Error('Only .jpg, .jpeg, .png files are allowed'), false);
    }
}
/* this is the multer magic. it gets the pic (the file)
 saves it and returns its location as a string */ 
const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{
        fileSize: 5 * 1024 * 1024 // Max file size: 5MB
    }
})



router.route('/')
    .post(upload.single('picture'), controller.createUser)
    //FOR DEBUGGING-  curl -X GET http://localhost:9000/api/users
    //.get(controller.getAllUsers) // get all users in DB

router.route('/me')
    .get(isLoggedIn, controller.getUser)

module.exports = router

