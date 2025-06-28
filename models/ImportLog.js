const mongoose = require('mongoose');

const ImportLogSchema = new mongoose.Schema({
  fileName: { type: String, required: true },         // e.g., feed URL
  importDateTime: { type: Date, default: Date.now },  // import timestamp
  totalFetched: { type: Number, default: 0 },
  newJobs: { type: Number, default: 0 },
  updatedJobs: { type: Number, default: 0 },
  failedJobs: { type: Number, default: 0 },
  failedReasons: [{ type: String }]                   // array of failure messages
});

module.exports = mongoose.model('ImportLog', ImportLogSchema);
