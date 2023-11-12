const express = require('express');
const router = express.Router();
const Playlist = require('../models/playlist');
const Podcast = require('../models/podcast');
const User = require('../models/user');
const auth = require('../middlewares/verifyToken');


// Add a podcast to a playlist

router.post('/:podcastId', auth, async (req, res, next) => {
  const userId = req.user.id;
  const podcastId = req.params.podcastId;
  const { playlistName } = req.body;

  try {
    const podcast = await Podcast.findById(podcastId);
    if (!podcast) {
      return res.status(404).json({ error: 'Podcast not found' });
    }

    const playlist = new Playlist({
      userId: userId,
      name: playlistName,
      podcasts: [podcastId], 
    });

    await playlist.save();

    res.status(201).json({ message: 'Playlist created successfully', playlist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
    next(error);
  }
});

module.exports = router;
