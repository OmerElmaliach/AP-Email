const mongoose = require('mongoose');

const labels = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  userId: { type: String, required: true },
  color: { type: String, required: true }

})

module.exports = mongoose.model('Labels', labels);
