const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/health-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        const uri = process.env.MONGODB_URI;
        if (uri) {
            console.error('MONGODB_URI debug info:');
            console.error('- Type:', typeof uri);
            console.error('- Length:', uri.length);
            console.error('- Starts with mongodb:// or mongodb+srv://:', uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://'));
            console.error('- Contains spaces:', uri.includes(' '));
            console.error('- Contains quotes:', uri.includes('"') || uri.includes("'"));
            // Safe log of start of URI
            console.error('- First 15 chars:', uri.substring(0, 15) + '...');
        } else {
            console.error('MONGODB_URI is undefined');
        }
    });

const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api', apiRoutes);

if (process.env.NODE_ENV !== 'production') {
    app.get('/', (req, res) => {
        res.send('Health Tracker API is running');
    });
}

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Any route not handled by the API will be handled by the React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
    });
}

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
