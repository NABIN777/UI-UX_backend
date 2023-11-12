const express = require('express');
const router = express.Router();
const Podcast = require('../models/podcast');
const Favorite=require('../models/favorite')
const User = require('../models/user');
const auth = require('../middlewares/verifyToken');



// Add favorite
// router.post('/:podcastId', auth, async (req, res) => {
//   const { podcastId } = req.params;
//   const userId = req.userId; // The user ID is extracted from the token in the authorizeUser middleware

//   try {
//     const podcast = await Podcast.findById(podcastId);

//     if (!podcast) {
//       return res.status(404).json({ error: 'Podcast not found' });
//     }
//     if (!Array.isArray(podcast.favorites)) {
//       podcast.favorites = []; // Initialize the favorites array if it doesn't exist
//     }

//     if (podcast.favorites.includes(userId)) {
//       return res.status(400).json({ error: 'Podcast is already in favorites' });
//     }

//     podcast.favorites.push(userId);
//     await podcast.save();

//     res.status(200).json(podcast);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });

// // Remove favorite
// router.delete('/podcasts/:id/favorites', async (req, res) => {
//   const podcastId = req.params.id;
//   const userId = req.body.userId;

//   try {
//     const podcast = await Podcast.findById(podcastId);

//     if (!podcast) {
//       return res.status(404).json({ error: 'Podcast not found' });
//     }

//     if (!podcast.favorites.includes(userId)) {
//       return res.status(400).json({ error: 'Podcast is not in favorites' });
//     }

//     podcast.favorites = podcast.favorites.filter((fav) => fav.toString() !== userId);
//     await podcast.save();

//     res.status(200).json(podcast);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });




// router.get('/:userId', auth, async (req, res) => {
//   const userId = req.params.userId; // The user ID is extracted from the token in the auth middleware

//   try {
//     // Find the user by userId
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Find all podcasts that have their ids in the user's favorites array
//     const favoritePodcasts = await Podcast.find({ _id: { $in: user.favorites } });

//     res.status(200).json(favoritePodcasts);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });


// module.exports = router;


router.post('/add/:podcastId', auth, async (req, res) => {
  const userId = req.user.id;
  const podcastId = req.params.podcastId;

  try {
    // Check if the podcast with the given podcastId exists
    const podcast = await Podcast.findById(podcastId);
    if (!podcast) {
      return res.status(404).json({ error: 'Podcast not found' });
    }

    // Check if the podcast is already in the user's favorites
    const existingFavorite = await Favorite.findOne({ user: userId, podcast: podcastId });
    if (existingFavorite) {
      return res.status(400).json({ error: 'Podcast is already in favorites' });
    }

    // Create a new Favorite document and save it to the database
    const favorite = new Favorite({ user: userId, podcast: podcastId });
    await favorite.save();

    res.status(200).json({ message: 'Podcast added to favorites successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
router.get('/podcast', auth, async (req, res) => {
  const userId = req.user.id;

  try {
    // Find the user by userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find all podcasts that have their ids in the user's favorites array
    const favoritePodcasts = await Favorite.find({ user: userId }).populate('podcast');
    const podcasts = favoritePodcasts.map(favorite => favorite.podcast);

    res.status(200).json(podcasts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
///// for removing podcasr
router.post('/remove/:podcastId', auth, async (req, res) => {
  const userId = req.user.id;
  const podcastId = req.params.podcastId;

  try {
    // Check if the podcast with the given podcastId exists
    const podcast = await Podcast.findById(podcastId);
    if (!podcast) {
      return res.status(404).json({ error: 'Podcast not found' });
    }

    // Check if the podcast is in the user's favorites
    const existingFavorite = await Favorite.findOne({ user: userId, podcast: podcastId });
    if (!existingFavorite) {
      return res.status(400).json({ error: 'Podcast is not in favorites' });
    }
    console.log(typeof existingFavorite);

    // Remove the podcast from the user's favorites
    await Favorite.deleteOne({ user: userId, podcast: podcastId });


    res.status(200).json({ message: 'Podcast removed from favorites successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;