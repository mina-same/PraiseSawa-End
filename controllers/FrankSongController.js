const FrankSong = require("../models/FrankSong");

// Get all songs
const getFrankSongs = async (req, res) => {
  console.log("getFrankSongs")
  try {
    const songs = await FrankSong.find();
    res.json(songs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get song by songID
const getFrankSongById = async (req, res) => {
  const songID = parseInt(req.params.id, 10);

  if (isNaN(songID)) {
    return res.status(400).json({ msg: "Invalid songID" });
  }

  try {
    const song = await FrankSong.findOne({ songID: songID });
    if (!song) {
      return res.status(404).json({ msg: "Song not found" });
    }
    res.json(song);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Search for songs
const searchForFrankSong = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ msg: "Query parameter is required" });
  }

  try {
    const songs = await FrankSong.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { verses: { $elemMatch: { $regex: query, $options: 'i' } } },
        { chorus: { $regex: query, $options: 'i' } },
      ],
    });

    res.json(songs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Create a new song
const createFrankSong = async (req, res) => {
  const { title, formated, chorus, verses, songID } = req.body;

  if (isNaN(songID)) {
    return res.status(400).json({ msg: "songID must be a number" });
  }

  try {
    const newSong = new FrankSong({ title, formated, chorus, verses, songID });
    const song = await newSong.save();
    res.json(song);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getFrankSongBySongID = async (req, res) => {  // Changed the function name here
  const songID = parseInt(req.params.songID, 10);

  if (isNaN(songID)) {
    return res.status(400).json({ msg: "Invalid songID" });
  }

  try {
    const song = await FrankSong.findOne({ songID: songID });
    if (!song) {
      return res.status(404).json({ msg: "Song not found" });
    }
    res.json(song);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = {
  getFrankSongs,
  createFrankSong,
  getFrankSongById,
  getFrankSongBySongID,  // Updated the export here
  searchForFrankSong,
};
