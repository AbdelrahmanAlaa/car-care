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

dotenv.config({
  path: `${__dirname}/config/config.env`,
})

const express = require('express');
const app = express();
const key = process.env.KEY;
app.use('/api',limiter)
app.use(express.json());
app.use('/api/',location);
app.use('/api/', loginSignUser);
app.use('/api/', getUsers);
app.use('/api/', loginSignWorker);
// app.use('/api/forgetPassword', forgetPassword);


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



