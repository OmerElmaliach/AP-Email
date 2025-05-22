const Mails = require('../models/mails');

/**
 * Returns fifty existing mails in reverse order by Id.
 *
 * @param {number} req - Request.
 * @param {number} res - Response.
 * @returns {number} Fifty Mails in json structure.
 */
exports.getUserMails = (req, res) => {
    // TODO: Add id verification with users method and convert id to mail ({id number} -> {mail}) using user class.
    const { id } = req.body;
    res.json(Mails.getUserMails(id));
}


/**
 * Creates a mail from one user to another.
 *
 * @param {number} req - Request.
 * @param {number} res - Response.
 * @returns {number} True if succeeded, otherwise false.
 */
exports.createMail = (req, res) => {
    // TODO: Add id verification with users method and convert id to mail ({id number} -> {mail}) using user class.
    const { to, subject, body, label } = req.body;
    if (Mails.createMail(id, to, subject, body, label)) {
        res.status(201);
    }

    return res.status(404).json({ error : "Failed to create mail" });
}