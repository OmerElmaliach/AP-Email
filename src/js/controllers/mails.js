const Mails = require('../models/mails');
const Model = require('../models/users');
const BlackList = require('../models/blacklist');
const Labels = require('../models/labels');
const urlRegex = /(?<![a-zA-Z0-9])((https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(\/\S*)?/g;

/**
 * Returns fifty existing mails in reverse order by Id.
 *
 * @param {string} req - Request.
 * @param {json} res - Response.
 * @returns {json} Fifty Mails in json structure.
 */
exports.getUserMails = (req, res) => {
    const userId = req.user.id;
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
exports.createMail = async (req, res) => {
    const userId = req.user.id;
    let { to, subject, body, label } = req.body;

    const userDB = Model.getUser("id", userId);

    const isDraft = Array.isArray(label) && label.includes("draft");

if (!isDraft && (!to || !Array.isArray(to) || to.length === 0)) {
    return res.status(404).json({ error: "Missing recipients for non-draft mail" });
} else if (userDB == undefined) {
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    if (label == undefined)
        label = [];
        
    if (!Array.isArray(label)) {
        return res.status(404).json({ error : "Invalid label format provided" });
    } else {
        for (let i = 0; i < label.length; i++) {
            if (Labels.getLabelById(label[i]) == undefined)
                return res.status(404).json({ error : "Invalid label provided" });
        }
    }
    
    // List to hold all the 'to' email's id's
    var toIds = [];

    if(!isDraft){
    // Check validation for each email in the 'to' section.
    for (var i = 0; i < to.length; i++) {
        let toUserDb = Model.getUser("email", to[i]);
        if (toUserDb == undefined){
            return res.status(404).json({ error : "Invalid receiver mails provided" });
        }
        toIds.push(toUserDb.id);
    }
    }
    // Save urls appearing in the mail's subject or body.
    let urlsSubject = subject.match(urlRegex) || [];
    let urlsBody = body.match(urlRegex) || [];    let hasBlacklistedURL = false;
    
    try {
        // Check for a list of urls if they are blacklisted.
        for (let i = 0; i < urlsSubject.length; i++) {
            let urlsValid = await BlackList.getBlacklistedURLById(urlsSubject[i]);
            if (urlsValid.endsWith("true")) {
                hasBlacklistedURL = true;
                break;
            }
        }
    
        if (!hasBlacklistedURL) {
            for (let i = 0; i < urlsBody.length; i++) {
                let urlsValid = await BlackList.getBlacklistedURLById(urlsBody[i]);
                if (urlsValid.endsWith("true")) {
                    hasBlacklistedURL = true;
                    break;
                }
            }
        }
        
    } catch (err) {
        return res.status(404).json({ error: err });
    }

    // If email contains blacklisted URLs, mark as spam and remove inbox label
    if (hasBlacklistedURL) {
        if (!label.includes("spam")) {
            label.push("spam");
        }
        // Remove inbox label if it exists
        label = label.filter(l => l !== "inbox");
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
    const userId = req.user.id;
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
exports.updateMail = async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;
    const { subject, body, label } = req.body;
    const userDB = Model.getUser("id", userId);
    if (userDB == undefined) {
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    if (label != undefined && !Array.isArray(label)) {
        return res.status(404).json({ error : "Invalid label format provided" });
    } else if (label != undefined && Array.isArray(label)) {
        for (let i = 0; i < label.length; i++) {
            if (Labels.getLabelById(label[i]) == undefined)
                return res.status(404).json({ error : "Invalid label provided" });
        }
    }    // Save urls appearing in the mail's subject or body.
    let urlsSubject = subject ? subject.match(urlRegex) || [] : [];
    let urlsBody = body ? body.match(urlRegex) || [] : [];
    let hasBlacklistedURL = false;

    try {
        // Check for a list of urls if they are blacklisted.
        for (let i = 0; i < urlsSubject.length; i++) {
            let urlsValid = await BlackList.getBlacklistedURLById(urlsSubject[i]);
            if (urlsValid.endsWith("true")) {
                hasBlacklistedURL = true;
                break;
            }
        }
    
        if (!hasBlacklistedURL) {
            for (let i = 0; i < urlsBody.length; i++) {
                let urlsValid = await BlackList.getBlacklistedURLById(urlsBody[i]);
                if (urlsValid.endsWith("true")) {
                    hasBlacklistedURL = true;
                    break;
                }
            }
        }
        
    } catch (err) {
        return res.status(404).json({ error: err });
    }

    // If email contains blacklisted URLs, mark as spam and remove inbox label
    if (hasBlacklistedURL && label) {
        if (!label.includes("spam")) {
            label.push("spam");
        }
        // Remove inbox label if it exists
        label = label.filter(l => l !== "inbox");
    }

    // updateMail returns true if mail was updated successfully, otherwise false.
    const mailCon = Mails.updateMail(userId, id, subject, body, label);
    if (!mailCon) {
        return res.status(404).json({ error : "Invalid mail id provided" });
    }

    return res.sendStatus(204);
}


/**
 * Deletes a mail by labeling it as trash.
 *
 * @param {string} req - Request.
 * @param {json} res - Response.
 * @returns {number} Status code indicating result.
 */
exports.deleteMail = (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;
    const userDB = Model.getUser("id", userId);
    if (userDB == undefined) {
        return res.status(404).json({ error : "Invalid user id provided" });
    }
    // Instead of deleting, update the mail put the "trash" 
    const mail = Mails.getMailById(userId, id);
    if (!mail) {
        return res.status(404).json({ error : "Invalid mail id provided" });
    }

    let currentLabels = mail.label ? (Array.isArray(mail.label) ? mail.label : [mail.label]) : [];
    
    // replace with trash label if not present
    if (!currentLabels.includes("trash")) {
        currentLabels = ["trash"];
        const updateResult = Mails.updateMail(userId, id, undefined, undefined, currentLabels);
        if (!updateResult) {
            return res.status(404).json({ error : "Invalid mail id provided" });
        }
    } else {
        const updateResult = Mails.deleteMail(userId, id);
        if (!updateResult) {
            return res.status(404).json({ error : "Invalid mail id provided" });
        }
    }

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
    const userId = req.user.id;
    const userDB = Model.getUser("id", userId);
    if (userDB == undefined) {
        return res.status(404).json({ error : "Invalid user id provided" });
    }

    return res.json(Mails.findMail(userId, query));
}
