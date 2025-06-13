
const model = require('../models/users')
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middleware/auth')


const signin = (req,res) =>{
    const { password , userName } = req.body; 
    //not to self- username and email are the same exact thing. 

    const user = model.getUser('userName', userName)
    //check id exists and that password matches 
    if (!user || user.password !== password ) {
        return res.status(404).json({error: 'User not found' })
    }
    //the token will hold in data userid and his email
    const data = { id: user.data, email: user.email }
    const token = jwt.sign(data, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
}

module.exports= {signin }