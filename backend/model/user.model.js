const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,      // ensure no duplicate emails
    lowercase: true,
    trim: true,
  },
}, { timestamps: true }); // adds createdAt and updatedAt automatically

module.exports = mongoose.model('User', userSchema);
