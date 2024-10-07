const mongoose = require('mongoose');

const ArbSongSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  formatted: {
    type: Boolean,
    required: true,
  },
  chorus: {
    type: [String],
    required: true,
  },
  verses: {
    type: [[String]], // Array of arrays of strings
    required: true,
  },
  songID: {
    type: Number,  // Defined as Number type
    required: true,
    unique: true,
  },
  englishTranslatedTitle: {
    type: String, // Add field for translated title
  },
  englishTranslatedChorus: {
    type: [String], // Add field for translated chorus
  },
  englishTranslatedVerses: {
    type: [[String]], // Add field for translated verses (array of arrays of strings)
  },
  artist: {
    type: String,
  },
  date: {
    type: String,
  },
  image: {
    type: String,
  },
  chordImage: {
    type: String,
  },
  duration:{
    type: String,
  },
  likes: {
    type: Number,
  },
  poppular: {
    type: Boolean,
  },
});

// Create the model for ArbSong and specify the collection name explicitly
const ArbSong = mongoose.model('ArbSong', ArbSongSchema, 'ArbSongs');

module.exports = ArbSong;
