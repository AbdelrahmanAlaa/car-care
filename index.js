const Joi = require('joi');
const config = require('config')
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const location = require('./routes/location');
const loginUser = require('./routes/authUsersRoutes');
const signUser = require('./routes/authUsersRoutes');
const loginWorker = require('./routes/authWorkerRoutes');
const signWorker = require('./routes/authWorkerRoutes');
const forgetPassword = require('./routes/forgetPassword');

const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/', location);
app.use('/api/', loginUser);
app.use('/api/', signUser);
app.use('/api/', loginWorker);
app.use('/api/', signWorker);
app.use('/api/forgetPassword', forgetPassword);


mongoose.connect("mongodb://localhost:27017/graduationproject", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected is done ')
        const port = process.env.PORT || 3030;
        const server = app.listen(port, () => console.log(`Listening on port http://localhost:${port} ...`));
    })
    .catch((err) => { console.log('somthing is wrong .. ', err) });


    // if (!config.get('jwtPrivatKey')){
    //     console.log('FATAL ERROR : jwtprivatekey is not defined ')
    //     // exit(0);
    //   }



