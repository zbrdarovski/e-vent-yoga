const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('News', NewsSchema);
