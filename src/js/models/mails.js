
const mongoose = require('mongoose');

//({"id" : id, "mail_id" : "e".concat(draftCounter.toString().concat("d")), 
// "from" : from, "to" : to, "subject" : subject, "body" : body, date_sent :
//  "N/A", "label" : ["draft"]});

const mails = new mongoose.Schema({
  id :{ type: String, required: true}, 
  mail_id: { type: String, required: true }, // mail id, all copys of the same mail have the same id
  from : { type: String, required: true },
  to: { type: [String], required: true}, // reciver name
  subject: { type: String, required: true },
  body: { type: String, required: true },
  date_sent: { type: String, required: true }, // a string created in the js, not a bd obj
  label: { type: [String], required: true },
});


module.exports = mongoose.model('Mails', mails);