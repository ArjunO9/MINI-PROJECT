const express = require('express');
const router = express.Router();

// Placeholder routes - we'll implement these later
router.post('/register', (req, res) => {
  res.json({ message: 'Business register endpoint' });
});

module.exports = router;