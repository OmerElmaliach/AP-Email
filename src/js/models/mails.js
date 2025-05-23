let idCounter = 0;
const EMAIL_AMOUNT = 50;
const mails =  [{"id" : "1", "mail_id" : "1e61", "from": "alice@gmail.com", "to": ["bob@gmail.com"], "subject": "Aliens", "body": "Dont forget to send me the photos", "date_sent": "2025-05-02 16:00:00", "label" : "IMPORTANT"},
                {"id" : "2", "mail_id" : "1e62", "from": "bob@gmail.com", "to": ["alice@gmail.com"], "subject": "Aliens", "body": "Will send in 5 minutes", "date_sent": "2025-05-02 18:00:00", "label" : "IMPORTANT"},
                {"id" : "1", "mail_id" : "1e63", "from": "alice@gmail.com", "to": ["bob@gmail.com"], "subject": "Aliens", "body": "Got it", "date_sent": "2025-05-02 20:00:00", "label" : "IMPORTANT"},
                {"id" : "1", "mail_id" : "1e64", "from": "alice@gmail.com", "to": ["alice@gmail.com"], "subject": "Fooled", "body": "I am the alien", "date_sent": "2025-05-02 22:00:00", "label" : "None"}
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
    mails.push({"id" : id, "mail_id" : "1e".concat(idCounter.toString()), "from" : from, "to" : to, "subject" : subject, "body" : body, "label" : label});
    idCounter++;
}


const getMailById = (mailId) => {
    return mails.filter(item => item.mail_id === mailId)
}


module.exports = {
    getUserMails,
    createMail,
    getMailById
}