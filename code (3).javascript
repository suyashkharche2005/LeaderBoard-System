const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
    name: String,
    points: { type: Number, default: 0 }
});

const User = mongoose.model('User ', userSchema);

// Claim Points API
app.post('/claim/:id', async (req, res) => {
    const userId = req.params.id;
    const randomPoints = Math.floor(Math.random() * 10) + 1;

    try {
        const user = await User.findByIdAndUpdate(userId, { $inc: { points: randomPoints } }, { new: true });
        res.json({ user, randomPoints });
    } catch (error) {
        res.status(500).json({ error: 'Error claiming points' });
    }
});

// Get Users API
app.get('/users', async (req, res) => {
    const users = await User.find().sort({ points: -1 });
    res.json(users);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
