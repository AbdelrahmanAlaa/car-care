const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const loginUser = require('./routes/loginUsers');
const loginWorker = require('./routes/loginWorker');
const signUser = require('./routes/authUsers');
const signWorker = require('./routes/authWorker');
const express = require('express');
const app = express();

app.use(express.json());
app.use('/api/loginUser', loginUser);
app.use('/api/loginWorker', loginWorker);
app.use('/api/signUser', signUser);
app.use('/api/signWorker', signWorker);


mongoose.connect("mongodb://localhost:27017/graduationproject", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected is done ')
        const port = process.env.PORT || 3030;
        const server = app.listen(port, () => console.log(`Listening on port http://localhost:${port} ...`));
    })
    .catch((err) => { console.log('somthing is wrong .. ', err) });






