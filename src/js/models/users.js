

const users_DB = [] 

let currentId = 1;
//add user to data base- in our case the array and set its id 
const addUser = (user) =>{
    user.id = currentId.toString()
    currentId++
    users_DB.push(user)
}


  /* function to get a user- enter key *string* to search and what val for that key 
   **MUST CHECK RETURN VAL** 
   */
const getUser = (field, value) => {
  if (value === undefined || value === null || value === '') return undefined;
  return users_DB.find(user => user[field] == value);
};

/*
updates a field of a user in users_DB
parameters:
id: User ID to find
field: Field name to update (string)
valueUpdate: New value for the field
*/
const updateValue = (id , field, valueUpdate)=>{
  const updatedUser = users_DB.find(user => user.id === id)
  if(updatedUser){
  updatedUser[field] = valueUpdate
}
}

/* for debugging- get all user
const getAllUsers = () => {
  return users_DB
}*/

module.exports= { addUser, getUser ,updateValue}
