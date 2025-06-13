/**
 * @fileoverview Labels Controller
 * 
 * This controller handles HTTP requests related to label management.
 * It provides CRUD operations for labels including creation, retrieval,
 * updating, and deletion. Labels are associated with users and are used
 * for email organization and categorization.
 * 
 * @author AP-Email Team
 * @version 1.0.0
 */

const model = require('../models/labels')
const usersModel = require('../models/users')

/**
 * Creates a new label
 * 
 * @function createLabel
 * @description Creates a new label with the provided information.
 * Validates required fields (id, name, userId, color) and checks
 * if the user exists and if the label ID is unique.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing label data
 * @param {string} req.body.id - Unique identifier for the label
 * @param {string} req.body.name - Display name of the label
 * @param {string} req.user.id - ID of the user who owns the label
 * @param {string} req.body.color - Color code for the label (e.g., "#FF0000")
 * @param {Object} res - Express response object
 * 
 * @returns {Object} HTTP response with status and JSON data
 * @returns {201} Success - Label created successfully
 * @returns {400} Bad Request - Missing mandatory fields or label ID already exists
 * @returns {404} Not Found - User not found
 * 
 * @example
 * // POST /api/labels
 * // Body: { "id": "label1", "name": "Important", "userId": "user123", "color": "#FF0000" }
 * // Response: { "message": "Label created", "label": {...} }
 */
const createLabel = (req, res)=>{
    const userId = req.user.id;
    const  { 
    id,
    name = null,
    color = null,
    } = req.body    //mandatory fields check - only id and userId are truly required
    if ( !id || !userId) {
        return res.status(400).json({ error: 'Missing mandatory field' });
    }// check userId exists
    if (usersModel.getUser("id", userId) == undefined) {
        return res.status(404).json({ error: 'User not found' });
    }
    // check if label with same id already exists
    if (model.getLabels('id', id).length > 0) {
        return res.status(400).json({ error: 'Label with this ID already exists' });
    }
    // all looks good, make label json and send to models
    const newLabel = {
        id,
        userId,
        name,
        color
    }
    model.createLabel(newLabel)
    return res.status(201).json({ message: 'Label created', label: newLabel });
}

/**
 * Retrieves labels for a specific user
 * 
 * @function getLabels
 * @description Fetches all labels belonging to a specific user.
 * Requires userId as a query parameter.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} req.user.id - ID of the user whose labels to retrieve
 * @param {Object} res - Express response object
 * 
 * @returns {Object} HTTP response with status and JSON data
 * @returns {200} Success - Array of labels for the user
 * @returns {400} Bad Request - User ID is required
 * @returns {404} Not Found - No labels found for this user
 * 
 * @example
 * // GET /api/labels?userId=user123
 * // Response: [{ "id": "label1", "name": "Important", "userId": "user123", "color": "#FF0000" }]
 */
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

/**
 * Retrieves all labels in the system
 * 
 * @function getAllLabels
 * @description Fetches all labels from the database without any filtering.
 * Used for administrative purposes or system-wide label management.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * 
 * @returns {Object} HTTP response with status and JSON data
 * @returns {200} Success - Array of all labels in the system
 * 
 * @example
 * // GET /api/labels/all
 * // Response: [{ "id": "label1", "name": "Important", "userId": "user123", "color": "#FF0000" }, ...]
 */
const getAllLabels = (req, res) => {
  const labels = model.getAllLabels()
  return res.status(200).json(labels)
}

/**
 * Retrieves a specific label by its ID
 * 
 * @function getLabelById
 * @description Fetches a single label using its unique identifier.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Unique identifier of the label
 * @param {Object} res - Express response object
 * 
 * @returns {Object} HTTP response with status and JSON data
 * @returns {200} Success - Label object
 * @returns {404} Not Found - Label not found
 * 
 * @example
 * // GET /api/labels/label123
 * // Response: { "id": "label123", "name": "Important", "userId": "user123", "color": "#FF0000" }
 */
const getLabelById = (req, res) => {
    const { id } = req.params;
    const label = model.getLabelById(id);
    if (!label) {
        return res.status(404).json({ error: 'Label not found' });
    }
    return res.status(200).json(label);
}

/**
 * Updates an existing label
 * 
 * @function updateLabel
 * @description Updates a label with new information. Only provided fields
 * will be updated, others remain unchanged.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Unique identifier of the label to update
 * @param {Object} req.body - Request body containing updated label data
 * @param {string} [req.body.name] - New name for the label
 * @param {string} [req.body.color] - New color for the label
 * @param {Object} res - Express response object
 * 
 * @returns {Object} HTTP response with status and JSON data
 * @returns {200} Success - Updated label object
 * @returns {404} Not Found - Label not found
 * 
 * @example
 * // PATCH /api/labels/label123
 * // Body: { "name": "Very Important", "color": "#FF8800" }
 * // Response: { "id": "label123", "name": "Very Important", "userId": "user123", "color": "#FF8800" }
 */
const updateLabel = (req, res) => {
    const { id } = req.params;

    const updatedLabel = model.updateLabel(id, req.body);
    if (!updatedLabel) {
        return res.status(404).json({ error: 'Label not found' });
    }
    return res.status(200).json(updatedLabel);
}

/**
 * Deletes a label
 * 
 * @function deleteLabel
 * @description Removes a label from the system using its unique identifier.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - Unique identifier of the label to delete
 * @param {Object} res - Express response object
 * 
 * @returns {Object} HTTP response with status and JSON data
 * @returns {200} Success - Confirmation message with deleted label
 * @returns {404} Not Found - Label not found
 * 
 * @example
 * // DELETE /api/labels/label123
 * // Response: { "message": "Label deleted", "label": {...} }
 */
const deleteLabel = (req, res) => {
    const { id } = req.params;
    const deletedLabel = model.deleteLabel(id);
    if (!deletedLabel) {
        return res.status(404).json({ error: 'Label not found' });
    }
    return res.status(200).json({ message: 'Label deleted', label: deletedLabel });
}

module.exports = {createLabel, getLabels, getAllLabels, getLabelById, updateLabel, deleteLabel}
