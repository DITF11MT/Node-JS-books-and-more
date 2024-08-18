const users = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret_kee';

// Register new user
const registerUser = async (req, res) => {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = { username, password: hashedPassword };
    users.push(newUser);

    res.status(201).json({ message: 'User registered successfully' });
};

// Login user
const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Find user
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });

    res.json({ token });
};

module.exports = { registerUser, loginUser };
