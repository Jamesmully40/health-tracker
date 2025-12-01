const mongoose = require('mongoose');

const HealthLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    systolic: {
        type: Number,
        required: true
    },
    diastolic: {
        type: Number,
        required: true
    },
    glucose: {
        type: Number, // mg/dL
        required: true
    },
    heartRate: {
        type: Number, // bpm
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('HealthLog', HealthLogSchema);
