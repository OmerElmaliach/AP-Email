

// A temporary "database" – just an array of user objects
const users = [];

// Add a new user
function addUser(user) {
  users.push(user);
}

// Get all users (optional helper)
function getUsers() {
  return users;
}

// Export the functions and data
module.exports = {
  users,
  addUser,
  getUsers
};


