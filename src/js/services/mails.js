
const Mails = require('../models/mails');// the mongoose mails model MMM


let idCounter = 0;
let draftCounter = 0;
const EMAIL_AMOUNT = 50;


/**
 * @param {string} userId Id of a user.
 * @returns fifty existing mails in reverse order by Id.
 */
const getUserMails = async (userId) => {
    // Concatenate from and to mails into one array, sort in reverse order.
    var mailList = await Mails.find({ id : userId })
    mailList = mailList.sort((a, b) => a.date_sent.localeCompare(b.date_sent)).reverse().slice(0, EMAIL_AMOUNT);

    // Return list without duplicates.
    return Array.from(new Map(mailList.map(item => [item.mail_id, item])).values());
}

/**
 * Helper to find a free mail_id based on counter and draft flag 
 */
async function getUniqueMailId(isDraft) {
  let counter = isDraft ? draftCounter : idCounter;
  while (true) {
    const mailId = isDraft ? `e${counter}d` : `e${counter}`;
    const existing = await Mails.findOne({ mail_id: mailId });
    if (!existing) {
      // Update the global counter so next call starts after this one
      if (isDraft) draftCounter = counter + 1;
      else idCounter = counter + 1;
      return mailId;
    }
    counter++;
  }
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
const createMail = async (id, from, to, toIds, subject, body, label) => {
    if (label.includes("draft")) {
        const mail_id = await getUniqueMailId(true);

        await Mails.create({"id" : id, "mail_id" : mail_id, "from" : from, 
            "to" : to, "subject" : subject, "body" : body, date_sent : "N/A", "label" : ["draft"]});
    } else {
        const email_id = await getUniqueMailId(false);
        // Instantly creates a json and adds to mail list.
        const date = new Date();
        const timestamp = date.toLocaleString()
        
        // For sender: add "sent" label unless it's spam or trash
        let senderLabels = Array.isArray(label) ? [...label] : (label ? [label] : []);
        if (!senderLabels.includes("spam") && !senderLabels.includes("trash")) {
            if (!senderLabels.includes("sent")) {
                senderLabels.push("sent");
            }
        }
        
        if (toIds.includes(id))
            senderLabels.push("inbox");
        await Mails.create({"id" : id, "mail_id" : email_id , "from" : from, "to" : to,
             "subject" : subject, "body" : body, date_sent : timestamp, "label" : senderLabels});
        
        // For receivers: add "inbox" label unless it's spam or trash
        for (var i = 0; i < toIds.length; i++) {
            if (toIds[i] != id) {
                let receiverLabels = Array.isArray(label) ? [...label] : (label ? [label] : []);
                if (!receiverLabels.includes("spam") && !receiverLabels.includes("trash")) {
                    if (!receiverLabels.includes("inbox")) {
                        receiverLabels.push("inbox");
                    }
                }
                await Mails.create({"id" : toIds[i], "mail_id" : email_id , "from" : from,
                     "to" : to, "subject" : subject, "body" : body, date_sent : timestamp,
                      "label" : receiverLabels});
            }
        }
    }
}


/**
 * @param {string} userId Id of a user.
 * @param {string} mailId Unique Id of a mail.
 * @returns Contents of a mail with unique id.
 */
const getMailById = async (userId, mailId) => {
    // Filter and return the specific mail.
    return Mails.findOne({ mail_id: mailId, id: userId });
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
const updateMail = async (userId, mailId, subject, body, label) => {
  const update = {};
  if (subject !== undefined) update.subject = subject;
  if (body !== undefined) update.body = body;
  if (label !== undefined) update.label = label;

  const result = await Mails.updateOne(
    { mail_id: mailId, id: userId },
    { $set: update }
  );

  // result.modifiedCount will be 1 if the update happened
  return result.modifiedCount > 0;
};

/**
 * @brief Deletes a mail.
 * 
 * @param {string} userId
 * @param {string} mailId
 * @returns True if deleted successfully, otherwise false.
 */
const deleteMail = async (userId, mailId) => {
    const deleted = await Mails.findOneAndDelete({ mail_id: mailId, id: userId });
    return deleted !== null;
}


/**
 * @param {string} userId
 * @param {string} query
 * @returns {Promise<Array>} A list of mails which include the query in any string field.
 */
const findMail = async (userId, query) => {
  // get all mails for user
  const mailLst = await Mails.find({ id: userId });

  const filtered = mailLst.filter(mail => {
    // check if ANY field contains the query string
    return Object.entries(mail.toObject()).some(([_, val]) => 
      typeof val === 'string' && val.includes(query)
    );
  });

  return filtered;
};


module.exports = {
    getUserMails,
    createMail,
    getMailById,
    updateMail,
    deleteMail,
    findMail
}