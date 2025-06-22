
const fs = require('fs');
const model = require('../models/users')
const path = require('path');


const getPhoto = (req, res) => {
    const userId = req.user.id;
    const user = model.getUser('id', userId);
    if (!user || !user.picture) {
        return res.status(404).json({ error: 'Photo not found' });
    }
  const photoPath = path.join(__dirname, '../models/userPhoto/', user.picture)
    res.sendFile(photoPath, (err) => {
  if (err) {
    console.error('Error sending photo:', err)
    return res.status(500).send('Error loading photo')
  }
})
}


module.exports = {getPhoto }
