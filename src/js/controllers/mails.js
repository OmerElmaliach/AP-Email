const Mails = require('../models/mails');
const Model = require('../models/users')
const bloomFilterAddress = '127.0.0.1';
const bloomFilterPort = 8089;
const urlRegex = /(?<![a-zA-Z0-9])((https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(\/\S*)?/g;


/**
 * @brief Validates whether a list of URLs are not blacklisted.
 * 
 * @param {list} urls 
 * @returns True if not blacklisted, otherwise false.
 */
function checkURLs(urls) {
    // Establish a connection with a cpp bloom filter server.
    var urlValid = true;
    const net = require('net');
    return new Promise((resolve, reject) => {
        const client = new net.Socket();
        client.connect(bloomFilterPort, bloomFilterAddress, () => {
            for (var i = 0; i < urls.length; i++) {
                client.write("GET " + urls[i]);
            }
        });

        // Handle data received.
        client.on('data', (data) => {
            for (var i = 0; i < urls.length; i++) {
                let serverRes = data.toString();
                if (serverRes.endsWith("true"))
                    urlValid = false;
            }
            client.end();
        });

        // Handle error in communication.
        client.on('error', (err) => {
            reject(err);
        });

        // Handle connection end.
        client.on('end', () => {
            resolve(urlValid)
        });
    });
};


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
exports.createMail = async (req, res) => {
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

    // Check validation for each email in the 'to' section.
    for (var i = 0; i < to.length; i++) {
        let toUserDb = Model.getUser("email", to[i]);
        if (toUserDb == undefined){
            return res.status(404).json({ error : "Invalid receiver mails provided" });
        }
        toIds.push(toUserDb.id);
    }

    // Save urls appearing in the mail's subject or body.
    let urlsSubject = subject.match(urlRegex) || [];
    let urlsBody = body.match(urlRegex) || [];

    try {
        // Check for a list of urls if they are blacklisted.
        let urlsValid = await checkURLs(urlsSubject);
        if (!urlsValid) {
            return res.status(400).json({ error: "Invalid URL provided" });
        }
    
        urlsValid = await checkURLs(urlsBody);
        if (!urlsValid) {
            return res.status(400).json({ error: "Invalid URL provided" });
        }
        
    } catch (err) {
        return res.status(404).json({ error: err });
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
