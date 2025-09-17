const express = require('express');
const QRCode = require('qrcode');
const Business = require('../models/Business');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET api/business
// @desc    Get business details for the logged-in user
router.get('/', auth, async (req, res) => {
    try {
        const business = await Business.findOne({ owner: req.user.id });
        if (!business) {
            return res.status(404).json({ msg: 'Business not found' });
        }
        res.json(business);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/business/generate-qr
// @desc    Generate and save QR code
router.post('/generate-qr', auth, async (req, res) => {
    try {
        const business = await Business.findOne({ owner: req.user.id });
        if (!business) {
            return res.status(404).json({ msg: 'Business not found' });
        }

        const qrCodeDataUrl = await QRCode.toDataURL(
            `http://localhost:3000/token/${business._id}` // NOTE: Change this URL if your frontend runs elsewhere
        );

        business.qrCode = qrCodeDataUrl;
        await business.save();

        res.json({ qrCode: qrCodeDataUrl });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/business/form-schema
// @desc    Update form schema for Data Collection Tier
router.put('/form-schema', auth, async (req, res) => {
    try {
        const business = await Business.findOneAndUpdate(
            { owner: req.user.id },
            { $set: { formSchema: req.body.formSchema } },
            { new: true }
        );
        res.json(business);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;