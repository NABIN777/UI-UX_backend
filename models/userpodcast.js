const mongoose = require('mongoose');

const userPodcastSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  podcast: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Podcast', // Make sure this refers to the correct model name (Podcast)
    required: true,
  },
});

module.exports = mongoose.model('UserPodcast', userPodcastSchema);