const mongoose = require('mongoose');


const users = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  birthday: { type: String, required: true },
  phoneNumber: { type: String, default: null }, // optional, ended up not using it in the end
  gender: { type: String, default: 'Prefer not to say' },
  picture: { type: String, required: true },
  labels: { type: Array, default: [] }, // optional array, default empty
});


module.exports = mongoose.model('Users', users);




