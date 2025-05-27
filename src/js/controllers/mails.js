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

    res.json(Mails.getUserMails(userId));
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
    // List to hold all the 'to' email's id's
    var toIds = [];
    if (userDB == undefined) { 
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    // TODO: Wait for implementation and change.
    // } else if (!isLabelValid(label)) {
    //     return res.status(404).json({ error : "Invalid label provided" });
    // }
    // TODO: Check if subject or body contain bad url's

    // Check validation for each email in the 'to' section.
    for (var i = 0; i < to.length; i++) {
        let toUserDb = Model.getUser("email", to[i]);
        if (toUserDb == undefined){
            return res.status(404).json({ error : "Invalid receiver mails provided" });
        }
        toIds.push(toUserDb.id);
    }

    Mails.createMail(userId, userDB.email, to, toIds, subject, body, label)
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
    const id = req.params.id;
    const { userId } = req.body;
    const userDB = Model.getUser("id", userId);
    if (userDB == undefined) {
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    const mail = Mails.getMailById(userId, id);
    if (mail == undefined) {
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
    const id = req.params.id;
    const { userId, subject, body, label } = req.body;
    const userDB = Model.getUser("id", userId);
    if (userDB == undefined) {
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    // TODO: Wait for implementation and change.
    // } else if ((label != undefined) && (!isLabelValid(label))) {
    //     return res.status(404).json({ error : "Invalid label provided" });
    // }

    // updateMail returns true if mail was updated successfully, otherwise false.
    const mailCon = Mails.updateMail(userDB.email, id, subject, body, label);
    if (!mailCon) {
        return res.status(404).json({ error : "Invalid mail id provided" });
    }

    return res.sendStatus(204);
}


/**
 * Deletes a mail.
 *
 * @param {string} req - Request.
 * @param {json} res - Response.
 * @returns {number} Status code indicating result.
 */
exports.deleteMail = (req, res) => {
    const id = req.params.id;
    const { userId } = req.body;
    const userDB = Model.getUser("id", userId);
    if (userDB == undefined) {
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    const delCon = Mails.deleteMail(userId, id);
    if (!delCon)
        return res.status(404).json({ error : "Invalid mail id provided" });

    return res.sendStatus(204);
}


/**
 * Given a specific query finds a mail.
 *
 * @param {string} req - Request.
 * @param {json} res - Response.
 * @returns {json} Requested mail with query value.
 */
exports.findMail = (req, res) => {
    const query = req.params.query;
    const { userId } = req.body;
    const userDB = Model.getUser("id", userId);
    if (userDB == undefined) {
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    return res.json(Mails.findMail(userDB.email, query));
}