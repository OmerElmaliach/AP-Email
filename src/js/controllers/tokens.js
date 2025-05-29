
const model = require('../models/users')



const checkIfUser = (req,res) =>{
    const { password , userName } = req.body;

    const user = model.getUser('userName', userName)
    //check id exists and that user name matches
    if (!user || user.password !== password ) {
        return res.status(404).json({error: 'User not found' })
    }
    
    const { id } = user
    return res.status(200).json({ id , userName})
}

module.exports= {checkIfUser }