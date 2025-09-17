const express = require('express');
const Razorpay = require('razorpay');
const shortid = require('shortid');
const crypto = require('crypto');
const Token = require('../models/Token');
const Business = require('../models/Business');

const router = express.Router();

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @route   POST api/payment/create-order
// @desc    Create a Razorpay order
router.post('/create-order', async (req, res) => {
    const { businessId } = req.body;
    try {
        const business = await Business.findById(businessId);
        if (!business || business.tier !== 'Prepaid') {
            return res.status(400).json({ msg: 'This business does not support prepaid tokens.' });
        }

        const options = {
            amount: business.servicePrice * 100, // Amount in paise
            currency: 'INR',
            receipt: shortid.generate()
        };

        const order = await razorpay.orders.create(options);
        res.json(order);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/payment/verify
// @desc    Verify payment and create token
router.post('/verify', async (req, res) => {
    const { businessId, formData, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
        return res.status(400).json({ msg: 'Transaction not legit!' });
    }

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastToken = await Token.findOne({ businessId, createdAt: { $gte: today } })
            .sort({ tokenNumber: -1 });

        const newTokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

        const newToken = new Token({
            businessId,
            tokenNumber: newTokenNumber,
            formData: formData || {},
            paymentId: razorpay_payment_id
        });

        await newToken.save();
        
        req.app.get('socketio').to(businessId).emit('new-token', newToken);

        res.status(201).json(newToken);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;