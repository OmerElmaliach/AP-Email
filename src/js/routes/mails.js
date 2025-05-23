const express = require('express');
const router = express.Router();
const controller = require('../controllers/mails');

router.route('/')
    .get(controller.getUserMails)
    .post(controller.createMail);

router.route('/:id')
    .get(controller.getMailById)
    .patch(controller.updateMail)
    .put(controller.updateMail)
    // .delete(controller.deleteMail);

router.route('/search:query')
    // .get(controller.findMail);

module.exports = router;