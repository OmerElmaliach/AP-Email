


const users_DB = [ // TEST USERS REMEMBER TO DELETE
  [
  {
    "id": "1",
    "firstName": "Alice",
    "lastName": "Cohen",
    "email": "alice@example.com",
    "userName": "alice@example.com",
    "password": "Alice1234",
    "birthday": "1995-06-01",
    "phoneNumber": "0501234567",
    "gender": "W",
    "picture": "/images/alice.jpg",
    "labels": ""
  },
  {
    "id": "2",
    "firstName": "Ben",
    "lastName": "Tzur",
    "email": "ben@example.com",
    "userName": "ben@example.com",
    "password": "BenTzur99",
    "birthday": "1990-03-12",
    "phoneNumber": "0527654321",
    "gender": "M",
    "picture": "/images/ben.png",
    "labels": ""
  },
  {
    "id": "3",
    "firstName": "Dana",
    "lastName": "Levi",
    "email": "dana@example.com",
    "userName": "dana@example.com",
    "password": "DanaL123",
    "birthday": "2000-09-25",
    "phoneNumber": null,
    "gender": "W",
    "picture": "/images/dana.png",
    "labels": ""
  }
]] // FOR TESTING

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
const getUser =  (field, value ) =>{
    return users_DB.find(user => user[field] == value)
}

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
