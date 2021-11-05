const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const users = require('./routes/loginUser');
const signUser = require('./routes/authUsers');
const signWorker = require('./routes/authWorker');
const express = require('express');
const app = express();

mongoose.connect("mongodb://localhost:27017/graduationproject", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('connected is done ')
        const port = process.env.PORT || 3030;
        const server = app.listen(port, () => console.log(`Listening on port http://localhost:${port} ...`));
    })
    .catch((err) => { console.log('somthing is wrong .. ', err) });

app.use(express.json());
app.use('/api/users', users);
app.use('/api/signUser', signUser);
app.use('/api/signWorker', signWorker);






