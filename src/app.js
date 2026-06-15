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

// Required for Vercel/Proxies
app.set('trust proxy', 1);

// 1. ULTRA PERMISSIVE CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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

// Database Connection (Serverless Pattern)
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000, // 30s
      socketTimeoutMS: 45000,
      family: 4
    };

    console.log('Connecting to MongoDB...');
    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((m) => {
      console.log('MongoDB Connected');
      return m;
    }).catch(err => {
      console.error('MongoDB Error:', err.message);
      cached.promise = null;
      throw err;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

// Middleware to ensure DB is connected
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB Connection FAIL:', err.message);
    res.status(500).json({ 
      success: false, 
      message: 'Database Connection Error',
      error: err.message 
    });
  }
});

// Export app for Vercel
module.exports = app;

const PORT = process.env.PORT || 3001;
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Local server on ${PORT}`));
}
