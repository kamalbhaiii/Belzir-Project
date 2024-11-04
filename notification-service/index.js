const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
require('dotenv').config()
const cors = require('cors')

app.use(cors({
    origin: 'http://localhost:3000'
}))

app.use(express.json())

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.post('/send-email', (req, res) => {
    const { to, subject, text } = req.body;
    transporter.sendMail({ from: process.env.EMAIL, to, subject, text }, (err, info) => {
        if (err) return res.status(500).send(err);
        res.status(200).send(info);
    });
});

app.listen(process.env.PORT, () => console.log('Notification Service running on port 3002'));
