const express = require('express');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const cors = require('cors');
require('dotenv').config();

const app = express();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

app.use(cors({ origin: 'http://localhost:3000' }));  // Enable CORS for frontend origin
app.use(express.json());


app.post('/verify-token', async (req, res) => {
    const { tokenId } = req.body;
    try {
        // Verify the Google token
        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // Generate JWT with user information
        const token = jwt.sign(
            { userId: payload.sub, email: payload.email, name: payload.name },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, name: payload.name, email: payload.email });

    } catch (error) {
        console.error('Error verifying Google token:', error);
        res.status(401).json({ message: 'Invalid Google token' });
    }
});

// Start the auth service server
app.listen(3001, () => console.log('Auth Service running on port 3001'));
