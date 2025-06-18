
const jwt = require('jsonwebtoken');


const model = require('../models/users')
const labelsModel = require('../models/labels')
const { SECRET_KEY } = require('../middleware/auth')




//mandatory fields: id, name, Email, userName, password, birthday.
// optional fields: phone, gender (W/M!), picture
const createUser = (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        birthday,
        phoneNumber = null,
        gender,
        labels = ''
    } = req.body
    const userName = email;
    //get picture from req.file added by multer
    if (!req.file) {
    return res.status(400).json({ error: 'Picture file is required' });
    }
    const picture = req.file.filename; // multer added the file name to here

    //mandatory fields check:
    if (!firstName || !lastName || !email || !userName || !password || !birthday || !gender || !picture) {
        return res.status(400).json({ error: 'Missing mandatory field' });
    }
    // check email address isnt taken 
    if (model.getUser('email', email)) {
        return res.status(409).json({ error: 'Email already in use' });
    }

    // check usename address isnt taken 
    if (model.getUser('userName', userName)) {
        return res.status(409).json({ error: 'userName already in use' });
    }
    //check password is valid- most be 8 chars and most include number and letters , with atleast one capital 
    const passwordError = validatePassword(password);
    if (passwordError) {
        return res.status(400).json({ error: passwordError });
    }
    function validatePassword(password) {
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!/\d/.test(password)) {
            return "Password must contain at least one number.";
        }
        //  only allow letters and digits
        if (!/^[a-zA-Z\d]+$/.test(password)) {
            return "Password can only contain letters and numbers.";
        }
        return null; // is valid
    }


    // all looks good, make user json and send to models
    const newUser = {
        firstName,
        lastName,
        email,
        userName,
        password,
        birthday,
        phoneNumber,
        gender,
        picture, //filename
        labels
    }
    model.addUser(newUser)

    // g.c - Create default label for the new user with null name and color, using idGenerator for ID
    const defaultLabel = {
        id: labelsModel.idGenerator(),
        name: null,
        userId: newUser.id.toString(),
        color: null
    }
    labelsModel.createLabel(defaultLabel)

    //get user token
    const user = model.getUser('userName', userName)
    //make sure user was indeed added
    if (!user || user.password !== password ) {
        return res.status(404).json({error: 'could not save user' })
    }
    //the token will hold in data userid and his email
    const data = { id: user.id, email: user.email }
    const token = jwt.sign(data, SECRET_KEY, { expiresIn: '1h' });
    

    return res.status(201).json({ message: 'User created', user: newUser, token });
}


//i chenged this to req.user.id; from param.id ,ake sure it still works
const getUser = (req, res) => {
    const id = req.user.id
    const user = model.getUser('id', id)
    if (!user) {
        return res.status(404).json({ error: 'User not found' })
    }
    //this gives the user his token for entering his inbox
    const { firstName, lastName, email, gender, picture } = user
    // taskes first and last and joins trings to one with space. if one is missing its  ok
    const fullName = [firstName, lastName].filter(Boolean).join(' ') 
    return res.status(200).json({ fullName, email, gender, picture })
}

/* for DEBUGGING
const getAllUsers = (req, res) => {
  const users = model.getAllUsers()
  return res.status(200).json(users)
}
*/
module.exports = { createUser, getUser }
