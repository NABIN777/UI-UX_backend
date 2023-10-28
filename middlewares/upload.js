const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Specify the destination folder where files will be stored
//   },
//   filename: (req, file, cb) => {
//     const fileName = uuidv4() + '-' + file.originalname; // Generate a unique filename using UUID
//     cb(null, fileName);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   // Filter the file types you want to allow
//   if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/Jpg') {
//     cb(null, true);
//   } else {
//     cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'));
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });

// const app = express();

// // Middleware for handling album picture uploads
// app.post('/upload/album', upload.single('albumPicture'), (req, res) => {
//   // Handle the uploaded file
//   const albumPicturePath = req.file.path;
//   // Additional logic for saving the file path to the database or performing other operations
//   res.status(200).json({ message: 'Album picture uploaded successfully' });
// });

// // Middleware for handling podcast audio uploads
// app.post('/upload/audio', upload.single('podcastAudio'), (req, res) => {
//   // Handle the uploaded file
//   const podcastAudioPath = req.file.path;
//   // Additional logic for saving the file path to the database or performing other operations
//   res.status(200).json({ message: 'Podcast audio uploaded successfully' });
// });

// // Start the server
// app.listen(3000, () => {
//   console.log('Server started on port 3000');
// });
