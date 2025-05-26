let idCounter = 0;
const EMAIL_AMOUNT = 50;
const mails =  [{"id" : "1", "mail_id" : "1e61", "from": "alice@gmail.com", "to": ["bob@gmail.com"], "subject": "Aliens", "body": "Dont forget to send me the photos", "date_sent": "07-06-2025 16:00:00", "label" : "IMPORTANT"},
                {"id" : "2", "mail_id" : "1e62", "from": "bob@gmail.com", "to": ["alice@gmail.com"], "subject": "Aliens", "body": "Will send in 5 minutes", "date_sent": "07-06-2025 18:00:00", "label" : "IMPORTANT"},
                {"id" : "1", "mail_id" : "1e63", "from": "alice@gmail.com", "to": ["bob@gmail.com"], "subject": "Aliens", "body": "Got it", "date_sent": "07-06-2025 20:00:00", "label" : "IMPORTANT"},
                {"id" : "1", "mail_id" : "1e64", "from": "alice@gmail.com", "to": ["alice@gmail.com"], "subject": "Fooled", "body": "I am the alien", "date_sent": "07-06-2025 22:00:00", "label" : "None"},
                {"id" : "3", "mail_id" : "1e65", "from": "omer@gmail.com", "to": ["omer@gmail.com"], "subject": "Test", "body": "This is a test", "date_sent": "07-06-2025 22:00:00", "label" : "IMPORTANT"}
               ];


const getUserMails = (id) => {
    const fromMail = mails.filter(item => item.from === id);
    const toMail = mails.filter(item => (Array.isArray(item.to) && item.to.includes(id)) || item.to === id);

    // Concatenate from and to mails into one array, sort in reverse order.
    var mailList = fromMail.concat(toMail);
    var mailList = mailList.sort((a, b) => a.date_sent.localeCompare(b.date_sent)).reverse().slice(0, EMAIL_AMOUNT);

    // Return list without duplicates.
    return Array.from(new Map(mailList.map(item => [item.mail_id, item])).values());
}


const createMail = (id, from, to, subject, body, label) => {
    // Instantly creates a json and adds to mail list.
    const date = new Date();
    mails.push({"id" : id, "mail_id" : "1e".concat(idCounter.toString()), "from" : from, "to" : to, "subject" : subject, "body" : body, date_sent : date.toLocaleString(), "label" : label});
    idCounter++;
}


const getMailById = (userEmail, mailId) => {
    // Filter and return the specific mail.
    return mails.find(item => item.mail_id === mailId && (item.from === userEmail || item.to.includes(userEmail)));
}


const updateMail = (userEmail, mailId, subject, body, label) => {
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

            // Mail was found and modified.
            return true;
        }
    }

    // No early return -> No mail was modified.
    return false;
}


const deleteMail = (userId, mailId) => {
    // Filter so that whoever wants to delete has the mail in his inbox.
    const delMail = mails.find(item => item.mail_id == mailId && item.id == userId);
    if (delMail.length == 0)
        return false;

    mails.splice(delMail, 1);
    return true;
}


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