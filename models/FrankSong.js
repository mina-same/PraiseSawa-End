const mongoose = require('mongoose');

// Define the schema for FrankSong
const FrankSongSchema = new mongoose.Schema({
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
});

// Create the model for FrankSong and specify the collection name explicitly
const FrankSong = mongoose.model('FrankSong', FrankSongSchema, 'FrankSongs');

module.exports = FrankSong;
