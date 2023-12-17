

require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const user_routes = require("./routes/user-routes.js");
const podcast_routes=require("./routes/podcast-routes.js");
const favorite_routes=require("./routes/favorite-routes.js");
const playlist_routes=require("./routes/playlist-routes.js");

const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const cors = require('cors');

// const port = process.env.PORT;

mongoose
  .connect("mongodb+srv://nirajankhanal777:Ux5rC9Wyc8n9o7tP@cluster0.uoacxsi.mongodb.net/?retryWrites=true&w=majority")
  // .connect('mongodb://127.0.0.1:27017/testing')
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();



app.use(express.json());
app.use(cors());
app.use(express.static('uploads'))
app.use('/uploads', express.static('uploads/albumPictures'));


// Configure Multer for album picture uploads
const albumPictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/albumPictures');
  },
  filename: (req, file, cb) => {
    const fileName = uuidv4() + '-' + file.originalname;
    cb(null, fileName);
  },
});

const albumPictureUpload = multer({
  storage: albumPictureStorage,
}).single('albumPicture');


// Configure Multer for podcast audio uploads
const podcastAudioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/podcastAudios');
  },
  filename: (req, file, cb) => {
    const fileName = uuidv4() + '-' + file.originalname;
    cb(null, fileName);
  },
});

const podcastAudioUpload = multer({
  storage: podcastAudioStorage,
  fileFilter: (req, file, cb) => {
    // Add logic to check the file type and filter as needed
    cb(null, true);
  },
}).single('podcastAudio');

// Handle album picture uploads
app.post('/upload/album', (req, res) => {
  albumPictureUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during the file upload
      console.log('Multer Error:', err.message);
      res.status(400).json({ error: 'File upload error' });
    } else if (err) {
      // An unknown error occurred during the file upload
      console.log('Error:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // File upload successful
      const albumPicturePath = req.file.path;
      // Additional logic for saving the file path to the database or performing other operations
      res.status(200).json({ message: 'Album picture uploaded successfully',
      data: req.file.filename, });
    }
  });
});

// Handle podcast audio uploads
app.post('/upload/audio', (req, res) => {
  podcastAudioUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred during the file upload
      console.log('Multer Error:', err.message);
      res.status(400).json({ error: 'File upload error' });
    } else if (err) {
      // An unknown error occurred during the file upload
      console.log('Error:', err.message);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      // File upload successful
      const podcastAudioPath = req.file.path;
      // Additional logic for saving the file path to the database or performing other operations
      res.status(200).json({ message: 'Podcast audio uploaded successfully',
      data: req.file.filename });
    }
  });
});

app.use("/users", user_routes);
app.use("/podcasts",podcast_routes);
app.use("/favorite",favorite_routes);
app.use("/playlists",playlist_routes);
app.use((err, req, res, next) => {
  console.error(err);
  if (err.name === "ValidationError" || err.name === "CastError") {
    res.status(400);
  } else {
    res.status(500);
  }
  res.json({ error: err.message });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use((req, res) => {
  res.status(404).json({ error: "Path Not Found" });
});

// app.listen(port, () => {
//   console.log(`Server is running at port ${port}`);
// });
module.exports = app;
