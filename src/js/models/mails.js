let idCounter = 0;
const EMAIL_AMOUNT = 50;
var mails =  [

    [// for testing DELTE THIS////////////////////////////////////////////////////////////////////////////////////////      
  {
    "id": "1",
    "mail_id": "e0",
    "from": "alice@example.com",
    "to": ["ben@example.com"],
    "subject": "Quarterly Report",
    "body": "Hi Ben, please review the Q2 report by Friday.",
    "date_sent": "6/16/2025, 9:00:00 AM",
    "label": ["Work"]
  },
  {
    "id": "1",
    "mail_id": "e1",
    "from": "alice@example.com",
    "to": ["dana@example.com"],
    "subject": "Dinner at Mom’s",
    "body": "Dana, are you free Sunday evening for dinner?",
    "date_sent": "6/15/2025, 5:30:00 PM",
    "label": ["Family"]
  },
  {
    "id": "1",
    "mail_id": "e2",
    "from": "alice@example.com",
    "to": ["ben@example.com", "dana@example.com"],
    "subject": "Team Meeting",
    "body": "Let’s meet Monday morning to sync.",
    "date_sent": "6/14/2025, 10:00:00 AM",
    "label": ["Work"]
  },
  {
    "id": "2",
    "mail_id": "e3",
    "from": "ben@example.com",
    "to": ["alice@example.com"],
    "subject": "Bill Reminder",
    "body": "Don’t forget to pay the phone bill.",
    "date_sent": "6/16/2025, 11:15:00 AM",
    "label": ["Bills"]
  },
  {
    "id": "2",
    "mail_id": "e4",
    "from": "ben@example.com",
    "to": ["dana@example.com"],
    "subject": "Urgent: Server Down",
    "body": "Dana, can you check the logs ASAP?",
    "date_sent": "6/15/2025, 2:45:00 PM",
    "label": ["Important"]
  },
  {
    "id": "2",
    "mail_id": "e5",
    "from": "ben@example.com",
    "to": ["alice@example.com", "dana@example.com"],
    "subject": "Shared Calendar",
    "body": "I've added everyone to the shared Google Calendar.",
    "date_sent": "6/14/2025, 9:00:00 AM",
    "label": ["Important"]
  },
  {
    "id": "3",
    "mail_id": "e6",
    "from": "dana@example.com",
    "to": ["alice@example.com"],
    "subject": "Weekend Shopping",
    "body": "Hey Alice, want to go shopping on Saturday?",
    "date_sent": "6/16/2025, 4:00:00 PM",
    "label": ["Shopping"]
  },
  {
    "id": "3",
    "mail_id": "e7",
    "from": "dana@example.com",
    "to": ["ben@example.com"],
    "subject": "Birthday Party!",
    "body": "You’re invited to my birthday bash Friday night!",
    "date_sent": "6/15/2025, 6:30:00 PM",
    "label": ["Social"]
  },
  {
    "id": "3",
    "mail_id": "e8",
    "from": "dana@example.com",
    "to": ["alice@example.com", "ben@example.com"],
    "subject": "Picnic Ideas",
    "body": "Let's plan a group picnic for next weekend.",
    "date_sent": "6/14/2025, 3:00:00 PM",
    "label": ["Social", "Shopping"]
  }
]


];


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
    
    // For sender: add "sent" label unless it's spam or trash
    let senderLabels = Array.isArray(label) ? [...label] : (label ? [label] : []);
    if (!senderLabels.includes("spam") && !senderLabels.includes("trash")) {
        if (!senderLabels.includes("sent")) {
            senderLabels.push("sent");
        }
    }
    
    mails.push({"id" : id, "mail_id" : "e".concat(idCounter.toString()), "from" : from, "to" : to, "subject" : subject, "body" : body, date_sent : timestamp, "label" : senderLabels});
    
    // For receivers: add "inbox" label unless it's spam or trash
    for (var i = 0; i < toIds.length; i++) {
        if (toIds[i] != id) {
            let receiverLabels = Array.isArray(label) ? [...label] : (label ? [label] : []);
            if (!receiverLabels.includes("spam") && !receiverLabels.includes("trash")) {
                if (!receiverLabels.includes("inbox")) {
                    receiverLabels.push("inbox");
                }
            }
            mails.push({"id" : toIds[i], "mail_id" : "e".concat(idCounter.toString()), "from" : from, "to" : to, "subject" : subject, "body" : body, date_sent : timestamp, "label" : receiverLabels});
        }
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
 * @param {string} userId
 * @param {string} query
 * @returns A mail which includes a specific string in one of its content.
 */
const findMail = (userId, query) => {
    const mailLst = getUserMails(userId);
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