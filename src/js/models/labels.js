/**
 * @fileoverview Labels Data Model
 * 
 * This module provides data management functionality for labels in the email system.
 * It implements an in-memory database using arrays and provides CRUD operations
 * for label management. Labels are used to categorize and organize emails.
 * 
 * @author AP-Email Team
 * @version 1.0.0
 */

/**
 * In-memory database for storing label objects
 * @type {Array<Object>}
 * @description Array containing all label objects in the system
 */
const labels_DB = []

/**
* Initialize default labels
* @description Creates default system labels that are available to all users
*/
const initializeDefaultLabels = () => {
  const defaultLabels = [
      { id: "inbox", name: "Inbox", userId: "system", color: "#1a73e8" },
      { id: "starred", name: "Starred", userId: "system", color: "#fbbc04" },
      { id: "sent", name: "Sent", userId: "system", color: "#34a853" },
      { id: "draft", name: "Draft", userId: "system", color: "#9aa0a6" },
      { id: "spam", name: "Spam", userId: "system", color: "#ea4335" },
      { id: "trash", name: "Trash", userId: "system", color: "#5f6368" }
// for testing DELTE THIS////////////////////////////////////////////////////////////////////////////////////////      

  ];
  
  defaultLabels.forEach(label => {
      if (!labels_DB.find(existing => existing.id === label.id)) {
          labels_DB.push(label);
      }
  });
}

// Initialize default labels when module loads
//initializeDefaultLabels();

/**
* Unique ID generator for labels
* @type {Function}
* @description Closure-based ID generator that creates sequential unique IDs.
* Uses an internal counter that increments with each call.
* 
* @returns {number} Unique sequential ID
* 
* @example
* const newId = idGenerator(); // Returns 1
* const anotherId = idGenerator(); // Returns 2
*/
const idGenerator = (() => {
  let id = 0;
  return () => {
      return ++id;
  };
})();

/**
* Adds a new label to the database
* 
* @function createLabel
* @description Stores a label object in the in-memory database array.
* 
* @param {Object} label - The label object to add
* @param {string} label.id - Unique identifier for the label
* @param {string} label.name - Display name of the label
* @param {string} label.userId - ID of the user who owns the label
* @param {string} label.color - Color code for the label (e.g., "#FF0000")
* 
* @example
* createLabel({
*   id: "label1",
*   name: "Important",
*   userId: "user123",
*   color: "#FF0000"
* });
*/
//add label to data base - in our case the array
const createLabel = (label) =>{
  labels_DB.push(label)
}

/**
* Retrieves labels based on field and value criteria
* 
* @function getLabels
* @description Searches for labels that match a specific field-value pair.
* Returns all matching labels as an array.
* 
* @param {string} field - The field name to search by (e.g., 'userId', 'id', 'name')
* @param {*} value - The value to match for the specified field
* 
* @returns {Array<Object>} Array of label objects that match the criteria
* 
* @example
* // Get all labels for a specific user
* const userLabels = getLabels('userId', 'user123');
* 
* // Get a specific label by ID
* const specificLabel = getLabels('id', 'label1');
*/
/* function to get labels - enter key *string* to search and what val for that key
Returns all matching labels as an array */
const getLabels = (field, value) => {
 return labels_DB.filter(label => label[field] === value)
}

/**
* Retrieves all labels in the system
* 
* @function getAllLabels
* @description Returns the complete array of all labels stored in the database.
* Used for administrative purposes or system-wide operations.
* 
* @returns {Array<Object>} Array containing all label objects
* 
* @example
* const allLabels = getAllLabels();
* console.log(`Total labels: ${allLabels.length}`);
*/
const getAllLabels = () => {
console.log("models",{labels_DB})
return labels_DB

}

/**
* Retrieves a single label by its unique identifier
* 
* @function getLabelById
* @description Finds and returns a specific label using its ID.
* 
* @param {string} id - The unique identifier of the label to retrieve
* 
* @returns {Object|undefined} The label object if found, undefined otherwise
* 
* @example
* const label = getLabelById('label123');
* if (label) {
*   console.log(`Found label: ${label.name}`);
* } else {
*   console.log('Label not found');
* }
*/
const getLabelById = (id) => {
return labels_DB.find(label => label.id === id);
}

/**
* Updates an existing label with new data
* 
* @function updateLabel
* @description Finds a label by ID and updates it with the provided data.
* Uses object spread to merge existing data with updates.
* 
* @param {string} id - The unique identifier of the label to update
* @param {Object} updatedLabel - Object containing the fields to update
* @param {string} [updatedLabel.name] - New name for the label
* @param {string} [updatedLabel.color] - New color for the label
* @param {string} [updatedLabel.userId] - New user ID (if transferring ownership)
* 
* @returns {Object|null} The updated label object if successful, null if label not found
* 
* @example
* const updated = updateLabel('label123', { name: 'Very Important', color: '#FF8800' });
* if (updated) {
*   console.log('Label updated successfully');
* }
*/
const updateLabel = (id, updatedLabel) => {
const index = labels_DB.findIndex(label => label.id === id);
if (index !== -1) {
  labels_DB[index] = { ...labels_DB[index], ...updatedLabel };
  return labels_DB[index];
}
return null;
}

/**
* Removes a label from the database
* 
* @function deleteLabel
* @description Finds and removes a label from the database using its ID.
* 
* @param {string} id - The unique identifier of the label to delete
* 
* @returns {Object|null} The deleted label object if successful, null if label not found
* 
* @example
* const deleted = deleteLabel('label123');
* if (deleted) {
*   console.log(`Deleted label: ${deleted.name}`);
* } else {
*   console.log('Label not found');
* }
*/
const deleteLabel = (id) => {
  const index = labels_DB.findIndex(label => label.id === id);
  if (index !== -1) {
    return labels_DB.splice(index, 1)[0];
  }
  return null;
}

/**
* Retrieves the default label for a specific user
* 
* @function getDefaultLabelForUser
* @description Finds and returns the default label for a user using their ID.
* The default label has null name and color and belongs to the specified user.
* 
* @param {string|number} userId - The ID of the user whose default label to retrieve
* 
* @returns {Object|undefined} The default label object if found, undefined otherwise
* 
* @example
* const defaultLabel = getDefaultLabelForUser('123');
* if (defaultLabel) {
*   console.log(`Default label ID: ${defaultLabel.id}`);
* }
*/
const getDefaultLabelForUser = () => {
return labels_DB.filter(label => label.userId === 'system');
};

module.exports = {createLabel, getLabels, getAllLabels, getLabelById, updateLabel, deleteLabel, idGenerator, getDefaultLabelForUser, initializeDefaultLabels}