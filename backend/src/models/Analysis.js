const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
  category: { type: String, required: true },
  suggestion: { type: String, required: true },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' }
});

const engagementScoreSchema = new mongoose.Schema({
  overall: { type: Number, min: 0, max: 100 },
  readability: { type: Number, min: 0, max: 100 },
  hashtags: { type: Number, min: 0, max: 100 },
  callToAction: { type: Number, min: 0, max: 100 },
  sentiment: { type: Number, min: 0, max: 100 },
  length: { type: Number, min: 0, max: 100 }
});

const analysisSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'image'], required: true },
  fileSize: { type: Number },
  extractedText: { type: String, required: true },
  wordCount: { type: Number },
  charCount: { type: Number },
  hashtags: [{ type: String }],
  mentions: [{ type: String }],
  emojis: [{ type: String }],
  engagementScore: engagementScoreSchema,
  suggestions: [suggestionSchema],
  platform: { type: String, enum: ['instagram', 'twitter', 'facebook', 'linkedin', 'general'], default: 'general' },
  sentiment: { type: String, enum: ['positive', 'negative', 'neutral'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analysis', analysisSchema);
