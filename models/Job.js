
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true, unique: true },
  company: { type: String },
  location: { type: String },
  jobType: { type: String },
  category: { type: String },
  externalId: { type: String, unique: true },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', JobSchema);
