const express = require('express');
const app = express();

//list of local js includes
//const mails = require('./routes/mails');
const users = require('./routes/users')
const tokens = require('./routes/tokens')

app.use(express.json())
//app.use('/api/mails', mails);
app.use('/api/users', users)
app.use('/api/tokens',tokens )

app.listen(9000);