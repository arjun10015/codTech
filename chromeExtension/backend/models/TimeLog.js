const mongoose = require('mongoose');

const TimeLogSchema = new mongoose.Schema({
  domain: String,
  timeSpent: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TimeLog', TimeLogSchema);
