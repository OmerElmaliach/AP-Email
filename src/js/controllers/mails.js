const Mails = require('../models/mails');
const Model = require('../models/users')

/**
 * Returns fifty existing mails in reverse order by Id.
 *
 * @param {string} req - Request.
 * @param {json} res - Response.
 * @returns {json} Fifty Mails in json structure.
 */
exports.getUserMails = (req, res) => {
    const { userId } = req.body;
    // Receive json containing information of a given user.
    const userDB = Model.getUser("id", userId);
    if (userDB == undefined) {
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    res.json(Mails.getUserMails(userDB.email));
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
    const userDB = Model.getUser("id", userId);
    if (userDB == undefined) { 
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    // TODO: Wait for implementation and change.
    // } else if (!isLabelValid(label)) {
    //     return res.status(404).json({ error : "Invalid label provided" });
    // }

    // Check validation for each email in the 'to' section.
    for (var i = 0; i < to.length; i++) {
        let toUserDb = Model.getUser("email", to[i]);
        if (toUserDb == undefined){
            return res.status(404).json({ error : "Invalid receiver mails provided" });
        }
    }

    Mails.createMail(userId, userDB.email, to, subject, body, label)
    return res.sendStatus(201);
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
    // TODO: Wait for implementation and change.
    if (!isIdValid(userId)) {
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    const mail = Mails.getMailById(id);
    if (mail.length == 0) {
        return res.status(404).json({ error : "Invalid mail id provided" });
    }

    return res.json(mail);
}


/**
 * Updates a mails content.
 *
 * @param {string} req - Request.
 * @param {json} res - Response.
 * @returns {number} Status code indicating result.
 */
exports.updateMail = (req, res) => {
    const { userId, id, title, body, label} = req.body;
    // TODO: Wait for implementation and change.
    if (!isIdValid(userId)) {
        return res.status(404).json({ error : "Invalid user id provided" });
    } else if ((label != undefined) && (!isLabelValid(label))) {
        return res.status(404).json({ error : "Invalid label provided" });
    }

    // updateMail returns true if mail was updated successfully, otherwise false.
    const mailCon = Mails.updateMail(userId, id, title, body, label);
    if (!mailCon) {
        return res.status(404).json({ error : "Invalid mail id provided" });
    }

    return res.status(201);
}


/**
 * Deletes a mail.
 *
 * @param {string} req - Request.
 * @param {json} res - Response.
 * @returns {number} Status code indicating result.
 */
exports.deleteMail = (req, res) => {
    const { userId, id } = req.body;
    // TODO: Wait for implementation and change.
    if (!isIdValid(userId)) {
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    const delCon = Mails.deleteMail(userId, id);
    if (!delCon)
        return res.status(404).json({ error : "Invalid mail id provided" });

    return res.status(204);
}


/**
 * Given a specific query finds a mail.
 *
 * @param {string} req - Request.
 * @param {json} res - Response.
 * @returns {json} Requested mail with query value.
 */
exports.findMail = (req, res) => {
    const { userId, query } = req.body;
    // TODO: Wait for implementation and change.
    if (!isIdValid(userId)) {
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    return res.json(Mails.findMail(userId, query));
}