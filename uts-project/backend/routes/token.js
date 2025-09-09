const express = require('express');
const router = express.Router();

// Placeholder routes - we'll implement these later
router.post('/:businessId', (req, res) => {
  res.json({ message: 'Token generation endpoint' });
});

router.get('/queue/:businessId', (req, res) => {
  res.json({ message: 'Queue status endpoint' });
});

router.patch('/next/:businessId', (req, res) => {
  res.json({ message: 'Next token endpoint' });
});

module.exports = router;