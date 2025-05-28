const mongoose = require('mongoose');

const contestSchema = new mongoose.Schema({
  code: { type: String, required: true },        // unique contest id/code (e.g., CF1234, LC5678)
  name: { type: String, required: true },        // contest name
  url: { type: String, required: true },         // contest link
  platform: {                                     // where contest is hosted
    type: String,
    enum: ['Codeforces', 'CodeChef', 'LeetCode'],
    required: true,
  },
  startTime: {                                    // Date object, exact contest start datetime
    type: Date,
    required: true,
  },
  durationSeconds: {                              // contest duration in seconds (helps for countdown + end time)
    type: Number,
    required: true,
  },
  notificationSent: {                             // flag if 4-hr email notification sent (avoid duplicate mails)
    type: Boolean,
    default: false,
  },
}, { timestamps: true });                         // createdAt, updatedAt auto fields

module.exports = mongoose.model('Contest', contestSchema);
