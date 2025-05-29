/**
 * @fileoverview Labels Routes
 * 
 * This module defines the Express.js routes for label management in the application.
 * It handles HTTP routing for CRUD operations on labels including creation,
 * retrieval, updating, and deletion. Labels are used for email categorization
 * and organization.
 * 
 * Routes:
 * - GET /api/labels - Get labels by user ID (query parameter)
 * - POST /api/labels - Create a new label
 * - GET /api/labels/:id - Get a specific label by ID
 * - PATCH /api/labels/:id - Update a specific label
 * - DELETE /api/labels/:id - Delete a specific label
 * 
 * @author AP-Email Team
 * @version 1.0.0
 */

// This file defines the routes for label management in the application.
// It includes routes for creating, retrieving, updating, and deleting labels.

const express = require('express');
const router = express.Router();
const controller = require('../controllers/labels');

/**
 * Label collection routes
 * @name LabelCollection
 * @route {GET} /api/labels
 * @route {POST} /api/labels
 */
router.route('/')
    /**
     * Get labels for a specific user
     * @name GetLabels
     * @route {GET} /api/labels
     * @queryparam {string} userId - ID of the user whose labels to retrieve
     * @returns {Object[]} 200 - Array of label objects
     * @returns {Error} 400 - User ID is required
     * @returns {Error} 404 - No labels found for this user
     */
    .get(controller.getLabels)
    /**
     * Create a new label
     * @name CreateLabel
     * @route {POST} /api/labels
     * @bodyparam {string} id - Unique identifier for the label
     * @bodyparam {string} name - Display name of the label
     * @bodyparam {string} userId - ID of the user who owns the label
     * @bodyparam {string} color - Color code for the label
     * @returns {Object} 201 - Created label object
     * @returns {Error} 400 - Missing mandatory fields or label already exists
     * @returns {Error} 404 - User not found
     */
    .post(controller.createLabel);

/**
 * Individual label routes
 * @name LabelResource
 * @route {GET} /api/labels/:id
 * @route {PATCH} /api/labels/:id
 * @route {DELETE} /api/labels/:id
 */
router.route('/:id')
    /**
     * Get a specific label by ID
     * @name GetLabelById
     * @route {GET} /api/labels/:id
     * @routeparam {string} id - Unique identifier of the label
     * @returns {Object} 200 - Label object
     * @returns {Error} 404 - Label not found
     */
    .get(controller.getLabelById)
    /**
     * Update a specific label
     * @name UpdateLabel
     * @route {PATCH} /api/labels/:id
     * @routeparam {string} id - Unique identifier of the label to update
     * @bodyparam {string} [name] - New name for the label
     * @bodyparam {string} [color] - New color for the label
     * @returns {Object} 200 - Updated label object
     * @returns {Error} 404 - Label not found
     */
    .patch(controller.updateLabel)
    /**
     * Delete a specific label
     * @name DeleteLabel
     * @route {DELETE} /api/labels/:id
     * @routeparam {string} id - Unique identifier of the label to delete
     * @returns {Object} 200 - Confirmation message with deleted label
     * @returns {Error} 404 - Label not found
     */
    .delete(controller.deleteLabel);

module.exports = router;