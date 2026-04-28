const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const assetRoutes = require('./routes/assets');
const flagRoutes = require('./routes/flags');

const app = express();

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/api/assets', assetRoutes);
app.use('/api/flags', flagRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🛡️ SportShield API is running!' });
});

// ── MongoDB Connection ───────────────────────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
