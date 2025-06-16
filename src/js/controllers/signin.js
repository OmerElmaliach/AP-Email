
const model = require('../models/users')
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../middleware/auth')


const signin = (req,res) =>{
    const { password , email } = req.body; 
    //not to self- username and email are the same exact thing. 

    const user = model.getUser('email', email)
    //check id exists and that password matches 
    if (!user || user.password !== password ) {
        console.log("JS: this means no user match");
        return res.status(404).json({error: 'wrong email or password' })
    }
    //the token will hold in data userid and his email
    console.log("JS: this means yes user match");
    const data = { id: user.id, email: user.email }
    const token = jwt.sign(data, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
}

module.exports= {signin }