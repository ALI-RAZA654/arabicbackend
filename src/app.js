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
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({ 
    success: true, 
    message: 'Server is alive',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
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
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve Uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Public Routes
app.use('/api/categories', require('./routes/public/categories'));
app.use('/api/products', require('./routes/public/products'));
app.use('/api/orders', require('./routes/public/orders'));
app.use('/api/settings', require('./routes/public/settings'));

// Admin Routes
app.use('/api/admin', require('./routes/admin/auth'));
app.use('/api/admin/products', require('./routes/admin/products'));
app.use('/api/admin/categories', require('./routes/admin/categories'));
app.use('/api/admin/orders', require('./routes/admin/orders'));
app.use('/api/admin/settings', require('./routes/admin/settings'));
app.use('/api/admin/upload', require('./routes/admin/upload'));
app.use('/api/admin/reset', require('./routes/admin/reset'));

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Freeze Dry API is running...' });
});

// Error Handling
app.use(errorHandler);

// Database Connection (Optimized for Serverless/Vercel)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is missing from environment variables!');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 20000, // Increase to 20s
      socketTimeoutMS: 45000,
      family: 4
    };

    // Global buffering disable
    mongoose.set('bufferCommands', false);

    console.log('Starting NEW database connection...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log('MongoDB Connected successfully!');
      return m;
    }).catch(err => {
      console.error('CRITICAL Database Connection Error:', err.message);
      cached.promise = null; 
      throw err;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

// Ensure DB is connected before every request
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB Middleware Error:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Database Connection Failed',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : 'Check Vercel Logs'
    });
  }
});

// Export app for Vercel
module.exports = app;

const PORT = process.env.PORT || 3001;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Local server on ${PORT}`));
}
