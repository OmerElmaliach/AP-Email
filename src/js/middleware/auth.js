
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '../../config/.env' }); 
const SECRET_KEY = process.env.SECRET_KEY;

const isLoggedIn = (req, res, next) => {
    // get the part of the header wich carrys authorization
    const authHeader = req.headers['authorization'];

    
    //exctract the token string (its at [1])
    const token = authHeader && authHeader.split(' ')[1]; 
        // no token send to signin
        if (!token) {
        return res.redirect('http://localhost:3000/signin'); 
        }
        try {
            // we extracted the token now test it with the key
            const data = jwt.verify(token, SECRET_KEY); 
            req.user = data
            return next() // continue down the pipeline to its rout
        } catch (err) {
                return res.redirect('http://localhost:3000/signin');
        }

}

module.exports ={isLoggedIn, SECRET_KEY}





