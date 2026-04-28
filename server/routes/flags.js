const express = require('express');
const router = express.Router();
const Flag = require('../models/Flag');
const Asset = require('../models/Asset');

// GET /api/flags - Get all flags (populated with asset info)
router.get('/', async (req, res) => {
  try {
    const flags = await Flag.find()
      .populate('asset', 'title assetType fingerprint status')
      .sort({ createdAt: -1 });
    res.json(flags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/flags/:id - Get single flag
router.get('/:id', async (req, res) => {
  try {
    const flag = await Flag.findById(req.params.id).populate('asset');
    if (!flag) return res.status(404).json({ error: 'Flag not found' });
    res.json(flag);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/flags - Report unauthorized use
router.post('/', async (req, res) => {
  try {
    // If asset is now flagged, update its status
    const flag = new Flag(req.body);
    const saved = await flag.save();

    // Update the parent asset status to 'flagged'
    await Asset.findByIdAndUpdate(req.body.asset, { status: 'flagged' });

    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/flags/:id - Update flag status (confirm / dismiss)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Flag.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: 'Flag not found' });

    // If flag dismissed, check if the asset has any other pending/confirmed flags
    // If not, revert asset to active
    if (req.body.resolvedStatus === 'dismissed') {
      const pendingFlags = await Flag.countDocuments({
        asset: updated.asset,
        resolvedStatus: { $in: ['pending', 'confirmed'] },
      });
      if (pendingFlags === 0) {
        await Asset.findByIdAndUpdate(updated.asset, { status: 'active' });
      }
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/flags/:id - Delete a flag
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Flag.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Flag not found' });
    res.json({ message: 'Flag deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/flags/stats/summary
router.get('/stats/summary', async (req, res) => {
  try {
    const total = await Flag.countDocuments();
    const pending = await Flag.countDocuments({ resolvedStatus: 'pending' });
    const confirmed = await Flag.countDocuments({ resolvedStatus: 'confirmed' });
    const dismissed = await Flag.countDocuments({ resolvedStatus: 'dismissed' });
    res.json({ total, pending, confirmed, dismissed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
