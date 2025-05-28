
const model = require('../models/labels')


// Create a new label
const createLabel = (req, res)=>{
    const  { 
    id,
    name,
    userId,
    color,        
    } = req.body

    //mandatory fields check:
    if (!id || !name || !userId || !color) {
        return res.status(400).json({ error: 'Missing mandatory field' });
    }
    // check userId exists
    if (!model.getUser('id', userId)) {
        return res.status(404).json({ error: 'User not found' });
    }
    // check if label with same id already exists
    if (model.getLabels('id', id).length > 0) {
        return res.status(400).json({ error: 'Label with this ID already exists' });
    }
    // all looks good, make label json and send to models
    const newLabel = {
        id,
        name,
        userId,
        color
    }
    model.addLabel(newLabel)
    return res.status(201).json({ message: 'Label created', label: newLabel });
}

// Get specific labels in req by user id
const getLabels = (req,res) =>{
    const { userId } = req.query;

    // Check if userId is provided
    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // Get labels for the specified user
    const labels = model.getLabels('userId', userId);

    // Check if any labels were found
    if (labels.length === 0) {
        return res.status(404).json({ error: 'No labels found for this user' });
    }

    return res.status(200).json(labels);
    
}

const getAllLabels = (req, res) => {
  const labels = model.getAllLabels()
  return res.status(200).json(labels)

}

// Get a label by ID
const getLabelById = (req, res) => {
    const { id } = req.params;
    const label = model.getLabelById(id);
    if (!label) {
        return res.status(404).json({ error: 'Label not found' });
    }
    return res.status(200).json(label);
}
// Update a label
const updateLabel = (req, res) => {
    const { id } = req.params;

    const updatedLabel = model.updateLabel(id, req.body);
    if (!updatedLabel) {


        return res.status(404).json({ error: 'Label not found' });
    }
    return res.status(200).json(updatedLabel);
}
// Delete a label
const deleteLabel = (req, res) => {
    const { id } = req.params;
    const deletedLabel = model.deleteLabel(id);
    if (!deletedLabel) {
        return res.status(404).json({ error: 'Label not found' });
    }
    return res.status(200).json({ message: 'Label deleted', label: deletedLabel });
}

module.exports = {createLabel, getLabels, getAllLabels, getLabelById, updateLabel, deleteLabel}
