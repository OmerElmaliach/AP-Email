


const labels_DB = []

let currentId = 1;
//add label to data base - in our case the array and set its id 
const addLabel = (label) =>{
    label.id = currentId++
    labels_DB.push(label)
}

/* function to get labels - enter key *string* to search and what val for that key
  Returns all matching labels as an array */
const getLabels = (field, value) => {
   return labels_DB.filter(label => label[field] === value)
}


const getAllLabels = () => {
  return labels_DB
}

const getLabelById = (id) => {
  return labels_DB.find(label => label.id === id)
}
const updateLabel = (id, updatedLabel) => {
  const index = labels_DB.findIndex(label => label.id === id);
  if (index !== -1) {
    labels_DB[index] = { ...labels_DB[index], ...updatedLabel };
    return labels_DB[index];
  }
return null;
}
const deleteLabel = (id) => {
  const index = labels_DB.findIndex(label => label.id === id);
  if (index !== -1) {
    return labels_DB.splice(index, 1)[0];
  }
  return null;
}

module.exports= { addLabel, getLabels, getAllLabels, getLabelById, updateLabel, deleteLabel }
