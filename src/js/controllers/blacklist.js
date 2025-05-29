// this file defines the controller for managing blacklisted URLs in the application.
// the controller includes functions for creating, deleting, and retrieving blacklisted URLs.
// the id of the URL should be the URL itself, as they are unique identifiers.
const model = require('../models/blacklist')

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


module.exports = { deleteFromBlacklist, getBlacklistedURLById, createBlacklistedURL }
