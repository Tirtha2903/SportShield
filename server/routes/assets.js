const express = require('express');
const router = express.Router();
const Asset = require('../models/Asset');

// GET /api/assets - Get all assets
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/assets/:id - Get single asset
router.get('/:id', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ error: 'Asset not found' });
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/assets - Register a new asset
router.post('/', async (req, res) => {
  try {
    const asset = new Asset(req.body);
    const saved = await asset.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/assets/:id - Update an asset
router.put('/:id', async (req, res) => {
  try {
    const updated = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Asset not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/assets/:id - Delete an asset
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Asset.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Asset not found' });
    res.json({ message: 'Asset deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/assets/stats/summary - Dashboard stats
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Asset.countDocuments();
    const active = await Asset.countDocuments({ status: 'active' });
    const flagged = await Asset.countDocuments({ status: 'flagged' });
    const verified = await Asset.countDocuments({ status: 'verified' });
    res.json({ total, active, flagged, verified });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
