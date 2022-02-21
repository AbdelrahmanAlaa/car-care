const { limiter } = require('./middleware/limiter');
const Joi = require('joi');
const config = require('config');
Joi.objectId = require('joi-objectid')(Joi);
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const location = require('./routes/location');
const getUsers = require('./routes/authUsersRoutes');
const loginSignUser = require('./routes/authUsersRoutes');
const loginSignWorker = require('./routes/authWorkerRoutes');
const cors = require('cors');
dotenv.config({
  path: `${__dirname}/config/config.env`,
})

const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());

app.use('/api',limiter)
app.use('/api/',location);
app.use('/api/', loginSignUser);
app.use('/api/', getUsers);
app.use('/api/', loginSignWorker);
// app.use('/api/forgetPassword', forgetPassword);

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});


mongoose.connect(process.env.CONNECT_DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected is done ')
        const port = process.env.PORT || 3030;
        const server = app.listen(port, () => console.log(`Listening on port http://localhost:${port} ...`));
    })
    .catch((err) => { console.log('something is wrong .. ', err) });


    if (!config.get('jwtPrivateKey')){
        console.log('FATAL ERROR : jwtPrivateKey is not defined ')
        // exit(0);
      }



