let idCounter = 0;
const EMAIL_AMOUNT = 50;
var mails =  [];


/**
 * @param {string} userId Id of a user.
 * @returns fifty existing mails in reverse order by Id.
 */
const getUserMails = (userId) => {
    // Concatenate from and to mails into one array, sort in reverse order.
    var mailList = mails.filter(item => item.id === userId);
    mailList = mailList.sort((a, b) => a.date_sent.localeCompare(b.date_sent)).reverse().slice(0, EMAIL_AMOUNT);

    // Return list without duplicates.
    return Array.from(new Map(mailList.map(item => [item.mail_id, item])).values());
}


/**
 * @brief Creates a mail.
 * 
 * @param {string} id
 * @param {string} from
 * @param {list} to
 * @param {list} toIds
 * @param {string} subject
 * @param {string} body
 * @param {string} label
 */
const createMail = (id, from, to, toIds, subject, body, label) => {
    // Instantly creates a json and adds to mail list.
    const date = new Date();
    const timestamp = date.toLocaleString()
    mails.push({"id" : id, "mail_id" : "e".concat(idCounter.toString()), "from" : from, "to" : to, "subject" : subject, "body" : body, date_sent : timestamp, "label" : label});
    for (var i = 0; i < toIds.length; i++) {
        mails.push({"id" : toIds[i], "mail_id" : "e".concat(idCounter.toString()), "from" : from, "to" : to, "subject" : subject, "body" : body, date_sent : timestamp, "label" : ""});
    }
    idCounter++;
}


/**
 * @param {string} userId Id of a user.
 * @param {string} mailId Unique Id of a mail.
 * @returns Contents of a mail with unique id.
 */
const getMailById = (userId, mailId) => {
    // Filter and return the specific mail.
    return mails.find(item => item.mail_id === mailId && item.id === userId);
}


/**
 * @brief Updates an existing mail based on input.
 * 
 * @param {string} userEmail
 * @param {string} mailId
 * @param {string} subject
 * @param {string} body
 * @param {string} label
 * @returns True if changed successfully, otherwise false.
 */
const updateMail = (userEmail, mailId, subject, body, label) => {
    let isFound = false;
    // Loop over all mails and modify the correct one.
    for (var i = 0; i < mails.length; i++) {
        if (mails[i].mail_id == mailId && mails[i].from === userEmail) {
            isFound = true;
            if (subject != undefined)
                mails[i].subject = subject;
            if (body != undefined)
                mails[i].body = body;
            if (label != undefined)
                mails[i].label = label;
        }
    }

    return isFound;
}


/**
 * @brief Deletes a mail.
 * 
 * @param {string} userId
 * @param {string} mailId
 * @returns True if deleted successfully, otherwise false.
 */
const deleteMail = (userId, mailId) => {
    // Filter so that whoever wants to delete has the mail in his inbox.
    const delMail = mails.find(item => item.mail_id == mailId && item.id == userId);
    if (delMail == undefined)
        return false;

    mails = mails.filter(item => item != delMail);
    return true;
}


/**
 * @param {string} userMail
 * @param {string} query
 * @returns A mail which includes a specific string in one of its content.
 */
const findMail = (userMail, query) => {
    const mailLst = getUserMails(userMail);
    var newLst = [];
    // Loop over all mails
    for (var i = 0; i < mailLst.length; i++) {
        // Loop over all key and value in a specific json mail.
        for (const [key, value] of Object.entries(mailLst[i])) {
            // Check for a match.
            if (value.includes(query)) {
                newLst.push(mailLst[i]);
                break;
            }
        }
    }

    return newLst;
}


module.exports = {
    getUserMails,
    createMail,
    getMailById,
    updateMail,
    deleteMail,
    findMail
}