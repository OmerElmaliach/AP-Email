const express = require('express');
const cors = require('cors');  
const { isLoggedIn } = require('./middleware/auth');
const mongoose = require('mongoose');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true                
}));

//list of local js includes
const signup = require('./routes/users');
const signin = require('./routes/signin')

const mails = require('./routes/mails');
const labels = require('./routes/labels');
const blacklist = require('./routes/blacklist');
const userPhoto = require('./routes/userPhoto');

//connect to database 
mongoose.connect('mongodb://localhost:27017/AP-Email', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log(' MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));



const labelsBD = require('./services/labels');
(async () => {
  await labelsBD.initializeDefaultLabels();
})();

app.use(express.json())
//these dont need token
app.use('/api/signin',signin )
app.use('/api/signup', signup);

//from here you need token. every req will go through  the middleware-
// it will check token is valid
app.use(isLoggedIn)

app.use('/api/mails', mails);
app.use('/api/labels', labels);
app.use('/api/blacklist', blacklist);
app.use('/api/userPhoto', userPhoto);


//any thing else will send to react signin
app.use((req, res) => {
  res.redirect('http://localhost:3000');
});

//console.log("About to start server...");
app.listen(9000, () => {
  console.log("Server is running on port 9000");
});

