const { limiter } = require('./middleware/limiter');
const Joi = require('joi');
const config = require('config');
Joi.objectId = require('joi-objectid')(Joi);
const dotenv = require('dotenv')
const mongoose = require('mongoose');;


const users = require('./routes/userRoutes');
const workers = require('./routes/workerRoutes');
const cors = require('cors');
dotenv.config({
  path: `${__dirname}/config/config.env`,
})

const express = require('express');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('img'))
<<<<<<< HEAD
=======

>>>>>>> 67a5873a6c89c9a225f0bc3ae85b53f0104bbdeb
app.use('/api',limiter)
app.use('/api/users', users);
app.use('/api/worker', workers);
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



