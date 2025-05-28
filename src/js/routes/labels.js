// This file defines the routes for label management in the application.
// It includes routes for creating, retrieving, updating, and deleting labels.

const express = require('express');
const router = express.Router();
const controller = require('../controllers/labels');

router.route('/')
    .get(controller.getLabels)
    .post(controller.createLabel);

router.route('/:id')
    .get(controller.getLabelById)
    .patch(controller.updateLabel)
    .delete(controller.deleteLabel);

module.exports = router;