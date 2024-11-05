const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  pictureUrl: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
});

module.exports = mongoose.model('Event', EventSchema);
