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
    const { id, to, subject, body, label } = req.body;
    // TODO: Wait for implementation and change.
    if (!isIdValid(id)) { 
        return res.status(404).json({ error : "Invalid id provided" });
    } else if (!isLabelValid(label)) {
        return res.status(404).json({ error : "Invalid label provided" });
    } else if (!exists(to)){
        return res.status(404).json({ error : "Invalid receiver mails provided" });
    }

    const from = convertToMail(id); // TODO: Wait for implementation and change.
    Mails.createMail(id, from, to, subject, body, label)
    return res.status(201);
}