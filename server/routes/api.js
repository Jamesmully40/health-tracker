const express = require('express');
const router = express.Router();
const HealthLog = require('../models/HealthLog');
const User = require('../models/User');

// Create a new log
router.post('/logs', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ message: 'User ID required' });
        }

        const newLog = new HealthLog({
            userId,
            systolic: req.body.systolic,
            diastolic: req.body.diastolic,
            glucose: req.body.glucose,
            heartRate: req.body.heartRate,
            timestamp: req.body.timestamp || Date.now()
        });

        const savedLog = await newLog.save();
        res.status(201).json(savedLog);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get all logs for a user
router.get('/logs', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.json([]);
        }
        const logs = await HealthLog.find({ userId }).sort({ timestamp: -1 });
        res.json(logs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
