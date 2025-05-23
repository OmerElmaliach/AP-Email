const Mails = require('../models/mails');

/**
 * Returns fifty existing mails in reverse order by Id.
 *
 * @param {string} req - Request.
 * @param {json} res - Response.
 * @returns {json} Fifty Mails in json structure.
 */
exports.getUserMails = (req, res) => {
    // TODO: Wait for implementation and change.
    const { userId } = req.body;
    if (!isIdValid(userId)) {
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    const mail = convertToMail(userId);
    res.json(Mails.getUserMails(mail));
}


/**
 * Creates a mail from one user to another.
 *
 * @param {string} req - Request.
 * @param {json} res - Response.
 * @returns {number} Status code indicating result.
 */
exports.createMail = (req, res) => {
    const { userId, to, subject, body, label } = req.body;
    // TODO: Wait for implementation and change.
    if (!isIdValid(userId)) { 
        return res.status(404).json({ error : "Invalid user id provided" });
    } else if (!isLabelValid(label)) {
        return res.status(404).json({ error : "Invalid label provided" });
    } else if (!mailExist(to)){
        return res.status(404).json({ error : "Invalid receiver mails provided" });
    }

    const from = convertToMail(userId); // TODO: Wait for implementation and change.
    Mails.createMail(userId, from, to, subject, body, label)
    return res.status(201);
}


/**
 * Returns a specific mail with given id.
 *
 * @param {string} req - Request.
 * @param {json} res - Response.
 * @returns {json} Details of specific mail.
 */
exports.getMailById = (req, res) => {
    const { userId, id } = req.body;
    if (!isIdValid(userId)) {
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    const mail = getMailById(id);
    if (mail.length == 0) {
        return res.status(404).json({ error : "Invalid mail id provided" });
    }

    return res.json(mail);
}