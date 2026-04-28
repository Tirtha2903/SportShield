const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const assetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Asset title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    assetType: {
      type: String,
      enum: ['image', 'video', 'document', 'audio', 'other'],
      default: 'image',
    },
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
    },
    organization: {
      type: String,
      trim: true,
      default: 'Unknown Organization',
    },
    fingerprint: {
      type: String,
      unique: true,
      default: () => uuidv4(), // auto-generate a unique fingerprint
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['active', 'flagged', 'verified', 'archived'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Asset', assetSchema);
