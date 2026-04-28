const mongoose = require('mongoose');

const flagSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset reference is required'],
    },
    suspectedUrl: {
      type: String,
      required: [true, 'Suspected URL is required'],
      trim: true,
    },
    reportedBy: {
      type: String,
      trim: true,
      default: 'Anonymous',
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    resolvedStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'dismissed'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Flag', flagSchema);
