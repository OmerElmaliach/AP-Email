


const users_DB = []

let currentId = 1;
//add user to data base- in our case the array and set its id 
const addUser = (user) =>{
    user.id = currentId++
    users_DB.push(user)
}

/* function to get a user- enter key *string* to search and what val for that key 
   **MUST CHECK RETURN VAL** */
const getUser =  (field, value ) =>{
    return users_DB.find(user => user[field] === value)
}

// for debugging- all users
const getAllUsers = () => {
  return users_DB
}
module.exports= { addUser, getUser ,         getAllUsers}
