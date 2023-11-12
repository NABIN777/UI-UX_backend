const express = require('express');
const router = express.Router();
const Podcast = require('../models/podcast');
const User = require('../models/user');
const auth = require('../middlewares/verifyToken');
const ffprobe = require('ffprobe');
const ffprobeStatic = require('ffprobe-static');
const path = require('path');
const userPodcasts=require('../models/userpodcast');
const { error } = require('console');


router.post('/', auth, async (req, res, next) => {
  try {
    const { title, description, audioUrl,duration, author, image, category } = req.body;
    const userId = req.user.id;

    // Calculate duration using ffprobe
    // const duration = await calculateAudioDuration(audioUrl);
    // console.log('Duration:', duration);

    const podcast = new Podcast({
      title: title,
      description: description,
      duration: duration,
      audioUrl: audioUrl,
      publicationDate: Date.now(),
      author: author,
      image: image,
      category: category,
      createdBy: userId
    });

    console.log('Podcast:', podcast);

    await podcast.save();
    res.sendStatus(201);
  } catch (error) {
    console.error('Error creating podcast:', error);
    next(error);
  }
});

router.get('/',auth,async (req, res, next) => {
  try {
  

    const allPodcasts = await Podcast.find();
    console.log('All podcasts:', allPodcasts);
    res.status(200).json({
      message: 'All podcasts',
      podcasts: allPodcasts
    })
  } catch (error) {
    console.error('Error retrieving podcast:', error);
    next(error);
  }
});

// Helper function to calculate audio duration using ffprobe
async function calculateAudioDuration(audioUrl) {
  try {
    const data = await ffprobe(audioUrl, { path: ffprobeStatic.path });
    const duration = data.streams[0].duration;
    return duration;
  } catch (error) {
    console.error('Error calculating audio duration:', error);
    return null;
  }
}

router.get('/:id', async (req, res, next) => {
  try {
    const podcastId = req.params.id;

    const podcast = await Podcast.findById(podcastId);

    res.json(podcast);
  } catch (error) {
    console.error('Error retrieving podcast:', error);
    next(error);
  }
});

router.put('/update', auth,async (req, res, next) => {
  try {
    const podcastId = req.params.id;
    const updatedPodcast = req.body;
    const userId= req.user.id;

    await Podcast.findByIdAndUpdate(podcastId, updatedPodcast);

    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating podcast:', error);
    next(error);
  }
});

router.delete('/:id', async (req, res) => {
  const podcastId = req.params.id;

  try {
    const podcast = await Podcast.findByIdAndDelete(podcastId);

    if (!podcast) {
      return res.status(404).json({ error: 'Podcast not found' });
    }

    res.status(200).json({ message: 'Podcast deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/images/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, '../images/', filename);
  res.sendFile(imagePath);
});

////////patch//////////////////////
router.patch('/:id', auth,async (req, res, next) => {
  try {
    const podcastId = req.params.id;
    const updatedPodcast = req.body;

    // Remove the audioUrl field from the updatedPodcast object
    // delete updatedPodcast.audioUrl;

    await Podcast.findByIdAndUpdate(podcastId, updatedPodcast);

    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating podcast:', error);
    next(error);
  }
});

/////// for getting podcast by specific user
router.get('/user/podcasts', auth, async (req, res, next) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userPodcasts = await Podcast.find({ createdBy: userId });
    const podcasts = userPodcasts.map(podcast => podcast);

    res.status(200).json({
      message: 'All podcasts',
      podcasts: podcasts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
    next(error); // Move 'next(error)' inside the catch block
  }
});
////////////////////get by categories

router.get('/category/:category?', async (req, res, next) => {
  try {
    const categoryToFilter = req.params.category;

    let filter = {};

    if (categoryToFilter) {
      // Assuming your category field is named 'category' in your model
      if (categoryToFilter.toLowerCase() !== 'all') {
        filter = { category: categoryToFilter };
      }
      // If the category field is not named 'category', adjust the filter accordingly
      // if (categoryToFilter.toLowerCase() !== 'all') {
      //   filter = { yourCategoryFieldName: categoryToFilter };
      // }
    }

    const podcastsByCategory = await Podcast.find(filter);

    res.status(200).json({
      message: categoryToFilter
        ? `Podcasts in the '${categoryToFilter}' category`
        : 'All podcasts',
      podcasts: podcastsByCategory,
    });
  } catch (error) {
    console.error('Error retrieving podcasts:', error);
    next(error);
  }
});

module.exports = router;
