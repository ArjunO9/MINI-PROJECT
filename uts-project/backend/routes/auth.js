const express = require('express');
const router = express.Router();

// Placeholder routes - we'll implement these later
router.post('/register', (req, res) => {
  res.json({ message: 'Auth register endpoint' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'Auth login endpoint' });
});

module.exports = router;