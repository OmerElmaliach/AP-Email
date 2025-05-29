// This file defines the routes for label management in the application.
// It includes routes for creating, retrieving, updating, and deleting labels.

const express = require('express');
const router = express.Router();
const controller = require('../controllers/blacklist');

router.route('/')
    .post(controller.createBlacklistedURL);

router.route('/:id')
    .get(controller.getBlacklistedURLById)
    .delete(controller.deleteFromBlacklist);

module.exports = router;