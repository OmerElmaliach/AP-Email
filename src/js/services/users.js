
const mongoose = require('mongoose');
const User = require('../models/users'); // your Mongoose model


//add user to data base
const addUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};


  /* function to get a user- enter key *string* to search and what val for that key 
   **MUST CHECK RETURN VAL** 
   */
const getUser = async (field, value) => {
  if (!value) return null;

  const query = {};
  if (field === 'id') {
    // convert value to ObjectId type (goto for _id queries)
    if (!mongoose.Types.ObjectId.isValid(value)) return null;
    query['_id'] = value;
  } else {
    query[field] = value;
  }
  return await User.findOne(query);
};

/*
updates a field of a user in users_DB
parameters:
id: User ID to find
field: Field name to update (string)
valueUpdate: New value for the field
*/

const updateValue = async (id, field, valueUpdate) => {
  if (!id) return null;

  const update = { [field]: valueUpdate };

  let queryId = id;
  //  convert to db obj
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return null; // or throw error if you want strictness
  }

  // Use findByIdAndUpdate to update by _id
  return await User.findByIdAndUpdate(queryId, update, { new: true });
};


module.exports= { addUser, getUser ,updateValue}
