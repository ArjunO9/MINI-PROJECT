const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Business = require('../models/Business');

const router = express.Router();

// @route   POST api/auth/register
// @desc    Register a new user and their business
router.post('/register', async (req, res) => {
  const { name, email, password, businessName, tier } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ name, email, password });
    await user.save();

    const business = new Business({
      name: businessName,
      owner: user._id,
      tier: tier
    });
    await business.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Login user
// Corrected Registration Route
// Corrected Registration Route
router.post('/register', async (req, res) => {
  const { name, email, password, businessName, tier } = req.body;
  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // Create and save the new user
    user = new User({ name, email, password });
    await user.save();

    // Create and save the new business, linking it to the new user
    const business = new Business({
      name: businessName,
      owner: user.id, // Use the newly created user's ID
      tier: tier
    });
    await business.save();
    
    // Create JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 }, // Token expires in 100 hours
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error during registration');
  }
});

module.exports = router;