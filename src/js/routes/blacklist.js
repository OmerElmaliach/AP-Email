/**
 * @fileoverview Blacklist Routes
 * 
 * This module defines the Express.js routes for URL blacklisting functionality.
 * It handles HTTP routing for operations related to managing blacklisted URLs
 * in the email system. The routes communicate with a Bloom filter-based backend
 * system for efficient URL filtering.
 * 
 * Routes:
 * - POST /api/blacklist - Add a URL to the blacklist
 * - GET /api/blacklist/:id - Check if a URL is blacklisted
 * - DELETE /api/blacklist/:id - Remove a URL from the blacklist
 * 
 * Note: The :id parameter should be the URL itself, as URLs serve as
 * unique identifiers in the blacklisting system.
 * 
 * @author AP-Email Team
 * @version 1.0.0
 */

// This file defines the routes for blacklist management in the application.
// It includes routes for creating, retrieving, and deleting blacklisted URLs.

const express = require('express');
const router = express.Router();
const controller = require('../controllers/blacklist');

/**
 * Blacklist collection routes
 * @name BlacklistCollection
 * @route {POST} /api/blacklist
 */
router.route('/')
    /**
     * Add a URL to the blacklist
     * @name CreateBlacklistedURL
     * @route {POST} /api/blacklist
     * @bodyparam {string} id - The URL to be blacklisted (serves as unique identifier)
     * @returns {Object} 201 - Success message with URL confirmation
     * @returns {Error} 400 - ID (URL) is required
     * @returns {Error} 500 - Backend communication error
     * 
     * @example
     * // Request body:
     * // { "id": "http://malicious-site.com" }
     * // Response:
     * // { "message": "Blacklisted URL created successfully", "url": "..." }
     */
    .post(controller.createBlacklistedURL);

/**
 * Individual blacklist URL routes
 * @name BlacklistResource
 * @route {GET} /api/blacklist/:id
 * @route {DELETE} /api/blacklist/:id
 */
router.route('/:id')
    /**
     * Check if a URL is blacklisted
     * @name GetBlacklistedURL
     * @route {GET} /api/blacklist/:id
     * @routeparam {string} id - The URL to check in the blacklist
     * @returns {Object} 200 - URL blacklist status information
     * @returns {Error} 400 - ID (URL) is required
     * @returns {Error} 404 - URL not found in blacklist
     * @returns {Error} 500 - Backend communication error
     * 
     * @example
     * // GET /api/blacklist/http://suspicious-site.com
     * // Response: URL blacklist status or confirmation
     */
    .get(controller.getBlacklistedURLById)
    /**
     * Remove a URL from the blacklist
     * @name DeleteBlacklistedURL
     * @route {DELETE} /api/blacklist/:id
     * @routeparam {string} id - The URL to remove from the blacklist
     * @returns {Object} 200 - Success message confirming deletion
     * @returns {Error} 400 - ID (URL) is required
     * @returns {Error} 500 - Backend communication error
     * 
     * @example
     * // DELETE /api/blacklist/http://malicious-site.com
     * // Response: { "message": "Blacklisted URL deleted successfully" }
     */
    .delete(controller.deleteFromBlacklist);

module.exports = router;