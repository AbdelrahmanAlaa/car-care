const { limiter } = require('./middleware/limiter');
const Joi = require('joi');
const config = require('config');
Joi.objectId = require('joi-objectid')(Joi);
const dotenv = require('dotenv')
const mongoose = require('mongoose');;


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
<<<<<<< HEAD

// 111111111111111111111111
app.use(express.static('img'))
=======
>>>>>>> e3868ac504112aaf5f6760d355252f6de5597d21

app.use('/api',limiter)
app.use('/api/users', loginSignUser);
app.use('/api/worker', loginSignWorker);
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



