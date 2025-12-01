const express = require('express');
const router = express.Router();
const HealthLog = require('../models/HealthLog');

// Get AI Recommendations
router.get('/recommendations', async (req, res) => {
    try {
        // In a real app, we would use the user ID from the token
        // For now, we'll accept it in the query or find the latest logs
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ message: 'User ID required' });
        }

        // Fetch last 5 logs
        const logs = await HealthLog.find({ userId }).sort({ timestamp: -1 }).limit(5);

        if (logs.length === 0) {
            return res.json({
                message: "Start logging your health data to get personalized AI recommendations!",
                type: "info"
            });
        }

        const latest = logs[0];
        const recommendations = [];

        // Simple Rule-based AI Logic

        // Blood Pressure Analysis
        if (latest.systolic > 140 || latest.diastolic > 90) {
            recommendations.push({
                category: "Blood Pressure",
                severity: "high",
                message: "Your recent blood pressure is elevated. Consider reducing sodium intake and practicing deep breathing exercises.",
                action: "Schedule a 10-minute walk today."
            });
        } else if (latest.systolic < 90 || latest.diastolic < 60) {
            recommendations.push({
                category: "Blood Pressure",
                severity: "medium",
                message: "Your blood pressure is a bit low. Ensure you are staying hydrated.",
                action: "Drink a glass of water now."
            });
        } else {
            recommendations.push({
                category: "Blood Pressure",
                severity: "low",
                message: "Great job! Your blood pressure is within the healthy range.",
                action: "Keep up the good work!"
            });
        }

        // Glucose Analysis
        if (latest.glucose > 140) {
            recommendations.push({
                category: "Glucose",
                severity: "high",
                message: "Your blood glucose is high. Avoid sugary foods and consider a low-carb meal for your next sitting.",
                action: "Check your glucose again in 2 hours."
            });
        } else if (latest.glucose < 70) {
            recommendations.push({
                category: "Glucose",
                severity: "high",
                message: "Your blood glucose is low (Hypoglycemia).",
                action: "Consume 15g of fast-acting carbs (e.g., fruit juice) immediately."
            });
        }

        res.json(recommendations);

    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
