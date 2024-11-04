const express = require('express');
const mongoose = require('mongoose');
const Request = require('./models/request_schema');
const app = express();
require('dotenv').config();
const cors = require('cors')
const jwt = require('jsonwebtoken')

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000'
}))

app.get('/get-requests', async (req, res) => {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (token) {
        const jwtData = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = jwtData;

        const userRequests = await Request.find({
            $or: [{ requestorEmail: email }, { superiorEmail: email }]
        });

        const requests = userRequests.map((request) => ({
            ...request.toObject(),
            isUserSuperior: request.superiorEmail === email
        }));

        res.status(200).send({ requests });
    } else {
        res.status(401).send('Unauthorized access prevented');
    }
});

app.post('/create-request', async (req, res) => {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (token) {
        const jwtData = jwt.verify(token, process.env.JWT_SECRET)
        const body = req.body;
        body.requestorName = jwtData.name;
        body.requestorEmail = jwtData.email;
        const request = new Request(body);
        await request.save();
        res.status(201).send(request);
    }
    else {
        res.status(401).send('Unauthorized access prevented')
    }
});

app.post('/approve-request/:id', async (req, res) => {
    const token = req.headers?.authorization?.split(' ')[1]
    if (token) {
        const jwtData = jwt.verify(token, process.env.JWT_SECRET)
        const request = await Request.findOneAndUpdate({ _id: req.params.id, superiorEmail: jwtData.email }, { status: 'Approved' }, { new: true });
        res.status(200).send(request);
    }
    else {
        res.status(401).send('Unauthorized access prevented')
    }
});

app.post('/reject-request/:id', async (req, res) => {
    const token = req.headers?.authorization?.split(' ')[1]
    if (token) {
        const jwtData = jwt.verify(token, process.env.JWT_SECRET)
        const request = await Request.findOneAndUpdate({ _id: req.params.id, superiorEmail: jwtData.email }, { status: 'Rejected' }, { new: true });
        res.status(200).send(request);
    }
    else {
        res.status(401).send('Unauthorized access prevented')
    }
});

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(process.env.PORT, () => console.log('Request Service running on port 3003')));
