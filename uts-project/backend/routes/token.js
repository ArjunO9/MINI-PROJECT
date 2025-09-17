const express = require('express');
const Token = require('../models/Token');
const Business = require('../models/Business');

const router = express.Router();

// @route   GET api/token/:businessId
// @desc    Get all tokens for a business
router.get('/:businessId', async (req, res) => {
    try {
        const tokens = await Token.find({ businessId: req.params.businessId }).sort({ createdAt: 1 });
        res.json(tokens);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/token/generate
// @desc    Generate a new token
router.post('/generate', async (req, res) => {
    const { businessId, formData } = req.body;
    try {
        const business = await Business.findById(businessId);
        if (!business) {
            return res.status(404).json({ msg: 'Business not found' });
        }

        if (business.tier === 'Data Collection' && !formData) {
            return res.status(400).json({ msg: 'Form data is required' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastToken = await Token.findOne({ businessId, createdAt: { $gte: today } })
            .sort({ tokenNumber: -1 });

        const newTokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

        const newToken = new Token({
            businessId,
            tokenNumber: newTokenNumber,
            formData: formData || {}
        });

        await newToken.save();
        
        req.app.get('socketio').to(businessId).emit('new-token', newToken);

        res.status(201).json(newToken);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/token/:id
// @desc    Update token status
router.put('/:id', async (req, res) => {
    try {
        const token = await Token.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        
        req.app.get('socketio').to(token.businessId.toString()).emit('token-update', token);

        res.json(token);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;