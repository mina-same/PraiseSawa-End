const express = require('express');
const router = express.Router();
const { getFrankSongs, createFrankSong, getFrankSongBySongID, searchForFrankSong, getFrankSongById } = require('../controllers/frankSongController');

// GET all songs
router.get('/getFrankSongs', getFrankSongs);
// http://localhost:5000/api/FrankSongs/getFrankSongs

// GET song by songID
router.get('/getFrankSongBySongID/:songID', getFrankSongBySongID);  // Use the correct name here
// http://localhost:5000/api/FrankSongs/getFrankSongBySongID/2

// GET song by songID
router.get('/getFrankSongById/:id', getFrankSongById);
// http://localhost:5000/api/FrankSongs/getFrankSongById/2

// Create a new song
router.post('/createFrankSong', createFrankSong);

// Search for songs
router.get('/searchForFrankSong', searchForFrankSong);
// http://localhost:5000/api/FrankSongs/searchForFrankSong?query=somequery

module.exports = router;
