const Mails = require('../models/mails');

/**
 * Returns fifty existing mails in reverse order by Id.
 *
 * @param {number} req - Request.
 * @param {number} res - Response.
 * @returns {number} Fifty Mails in json structure.
 */
exports.getUserMails = (req, res) => {
    const { id } = req.body;
    res.json(Mails.getUserMails(id));
}