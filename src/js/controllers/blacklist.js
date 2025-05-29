/**
 * @fileoverview Blacklist Controller
 * 
 * This controller handles HTTP requests related to URL blacklisting functionality.
 * It provides operations for creating, retrieving, and deleting blacklisted URLs.
 * The controller communicates with a Bloom filter-based backend system through
 * a client process to manage URL blacklisting efficiently.
 * 
 * The ID parameter should be the URL itself, as URLs serve as unique identifiers
 * in the blacklisting system.
 * 
 * @author AP-Email Team
 * @version 1.0.0
 */

// this file defines the controller for managing blacklisted URLs in the application.
// the controller includes functions for creating, deleting, and retrieving blacklisted URLs.
// the id of the URL should be the URL itself, as they are unique identifiers.
const model = require('../models/blacklist')

/**
 * Creates a new blacklisted URL entry
 * 
 * @function createBlacklistedURL
 * @description Adds a URL to the blacklist system. The URL is processed through
 * a Bloom filter for efficient storage and retrieval. The ID should be the URL itself.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing URL data
 * @param {string} req.body.id - The URL to be blacklisted (serves as unique identifier)
 * @param {Object} res - Express response object
 * 
 * @returns {Object} HTTP response with status and JSON data
 * @returns {201} Success - URL successfully added to blacklist
 * @returns {400} Bad Request - ID (URL) is required
 * @returns {500} Internal Server Error - Backend communication error
 * 
 * @example
 * // POST /api/blacklist
 * // Body: { "id": "http://malicious-site.com" }
 * // Response: { "message": "Blacklisted URL created successfully", "url": "..." }
 */
const createBlacklistedURL = (req, res) => {
    const { id } = req.body;

    // Check if ID is provided
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    // Call the model function to create the blacklisted URL
    model.createBlacklistedURL(id)
        .then(url => res.status(201).json({ message: 'Blacklisted URL created successfully', url }))
        .catch(err => res.status(500).json({ error: err.message }));
}

/**
 * Removes a URL from the blacklist
 * 
 * @function deleteFromBlacklist
 * @description Removes a URL from the blacklist system. Note that due to the nature
 * of Bloom filters, this operation removes the URL from storage but may not
 * completely remove it from the filter itself.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - The URL to be removed from blacklist
 * @param {Object} res - Express response object
 * 
 * @returns {Object} HTTP response with status and JSON data
 * @returns {200} Success - URL successfully removed from blacklist
 * @returns {400} Bad Request - ID (URL) is required
 * @returns {500} Internal Server Error - Backend communication error
 * 
 * @example
 * // DELETE /api/blacklist/http://malicious-site.com
 * // Response: { "message": "Blacklisted URL deleted successfully" }
 */
const deleteFromBlacklist = (req, res) => {
    const { id } = req.params;

    // Check if ID is provided
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    // Call the model function to delete the URL
    model.deleteFromBlacklist(id)
        .then(() => res.status(200).json({ message: 'Blacklisted URL deleted successfully' }))
        .catch(err => res.status(500).json({ error: err.message }));
}

/**
 * Retrieves a blacklisted URL by its identifier
 * 
 * @function getBlacklistedURLById
 * @description Checks if a URL is in the blacklist and retrieves its information.
 * This operation queries the Bloom filter system to determine if the URL
 * is potentially blacklisted.
 * 
 * @param {Object} req - Express request object
 * @param {Object} req.params - Route parameters
 * @param {string} req.params.id - The URL to check in the blacklist
 * @param {Object} res - Express response object
 * 
 * @returns {Object} HTTP response with status and JSON data
 * @returns {200} Success - URL information if found in blacklist
 * @returns {400} Bad Request - ID (URL) is required
 * @returns {404} Not Found - URL not found in blacklist
 * @returns {500} Internal Server Error - Backend communication error
 * 
 * @example
 * // GET /api/blacklist/http://malicious-site.com
 * // Response: URL data or confirmation of blacklist status
 */
const getBlacklistedURLById = (req, res) => {
    const { id } = req.params;

    // Check if ID is provided
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    // Call the model function to get the blacklisted URL
    model.getBlacklistedURLById(id)
        .then(url => {
            if (!url) {
                return res.status(404).json({ error: 'Blacklisted URL not found' });
            }
            res.status(200).json(url);
        })
        .catch(err => res.status(500).json({ error: err.message }));
}


module.exports = { createBlacklistedURL, deleteFromBlacklist, getBlacklistedURLById }
