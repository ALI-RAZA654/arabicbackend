require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const { publicLimiter, adminLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

// Initialize App
const app = express();

// Root/Heartbeat Route to check if API is alive
app.get('/api/heartbeat', (req, res) => {
  res.json({ success: true, message: 'Server is alive' });
});

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

const allowedOrigins = [
  'https://freezdry.net',
  'https://www.freezdry.net',
  'https://arabic-frontend.vercel.app',
  'https://lightgreen-woodcock-596987.hostingersite.com',
  'http://localhost:5173'
];

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Public Routes
app.use('/api/categories', publicLimiter, require('./routes/public/categories'));
app.use('/api/products', publicLimiter, require('./routes/public/products'));
app.use('/api/orders', publicLimiter, require('./routes/public/orders'));
app.use('/api/settings', publicLimiter, require('./routes/public/settings'));

// Admin Routes
app.use('/api/admin', adminLimiter, require('./routes/admin/auth'));
app.use('/api/admin/products', adminLimiter, require('./routes/admin/products'));
app.use('/api/admin/categories', adminLimiter, require('./routes/admin/categories'));
app.use('/api/admin/orders', adminLimiter, require('./routes/admin/orders'));
app.use('/api/admin/settings', adminLimiter, require('./routes/admin/settings'));
app.use('/api/admin/upload', adminLimiter, require('./routes/admin/upload'));
app.use('/api/admin/reset', adminLimiter, require('./routes/admin/reset'));

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Freeze Dry API is running...' });
});

// Error Handling
app.use(errorHandler);

// Database Connection
const PORT = process.env.PORT || 3001;
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });

// Export app for Vercel Serverless Functions
module.exports = app;

// Only listen on local environment (Vercel automatically handles listening)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
