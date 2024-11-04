const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    title: String,
    description: String,
    type: String,
    urgency: String,
    status: { type: String, default: 'Pending' },
    requestorName: String,
    requestorEmail: String,
    superiorEmail: String
});

module.exports = mongoose.model('Request', requestSchema);
