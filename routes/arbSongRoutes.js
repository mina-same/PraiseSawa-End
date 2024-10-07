const express = require('express');
const router = express.Router();
const { getArbSongs, createSong, getArbSongBySongID, searchForArbSong, getEnglishTranslation } = require('../controllers/ArbSongController');

// GET all songs
router.get('/getArbSongs', getArbSongs);
// http://localhost:5000/api/ArbSongs/getArbSongs

// GET song by songID
router.get('/getArbSongBySongID/:songID', getArbSongBySongID);
// http://localhost:5000/api/ArbSongs/getArbSongBySongID/2

// Search for songs
router.get('/searchForArbSong', searchForArbSong);
// http://localhost:5000/api/ArbSongs/searchForArbSong?query=somequery

// Translate to English
router.get('/translateToEnglish/:songID', getEnglishTranslation);


// Create a new song
router.post('/createSong', createSong);

module.exports = router;
