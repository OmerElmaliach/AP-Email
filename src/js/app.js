const express = require('express');
const app = express();

//lis of local js includes
const mails = require('./routes/mails');
const users = require('./routes/users');
const users = require('./routes/labels');


app.use(express.json())
//app.use('/api/mails', mails);
app.use('/api/users', users);
app.use('/api/labels', labels);


app.listen(9000);