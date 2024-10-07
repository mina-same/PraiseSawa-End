const ArbSong = require("../models/ArbSong");
const translate = require('translate-google');

// Helper function for retrying translation
const translateWithRetry = async (text, options, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await translate(text, options);
    } catch (err) {
      if (attempt === retries) {
        throw err; // Re-throw the error if it's the last attempt
      }
      console.warn(`Retry ${attempt}/${retries} failed for text: "${text}". Retrying...`);
    }
  }
};

// Get all songs
const getArbSongs = async (req, res) => {
  try {
    const songs = await ArbSong.find();
    res.json(songs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get song by songID
const getArbSongBySongID = async (req, res) => {
  const songID = parseInt(req.params.songID, 10);

  if (isNaN(songID)) {
    return res.status(400).json({ msg: "Invalid songID" });
  }

  try {
    const song = await ArbSong.findOne({ songID: songID });
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
const searchForArbSong = async (req, res) => {
  const { query, page = 1, limit = 5 } = req.query;

  if (!query) {
    return res.status(400).json({ msg: "Query parameter is required" });
  }

  const skip = (page - 1) * limit;

  try {
    const songs = await ArbSong.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { verses: { $elemMatch: { $regex: query, $options: "i" } } },
        { chorus: { $regex: query, $options: "i" } },
      ],
    })
      .skip(skip)
      .limit(parseInt(limit));

    res.json(songs);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Create a new song
const createSong = async (req, res) => {
  const { title, formatted, chorus, verses, songID } = req.body;

  if (isNaN(songID)) {
    return res.status(400).json({ msg: "songID must be a number" });
  }

  try {
    const newSong = new ArbSong({ title, formatted, chorus, verses, songID });
    const song = await newSong.save();
    res.json(song);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Get English translation of a song by ID
const getEnglishTranslation = async (req, res) => {
  const songID = parseInt(req.params.songID, 10); // Assuming songID is passed as a number

  try {
    // Fetch the song from MongoDB
    const song = await ArbSong.findOne({ songID: songID });

    if (!song) {
      return res.status(404).json({ msg: "Song not found" });
    }

    // Check if translations already exist
    let englishTranslatedTitle = song.englishTranslatedTitle;
    let englishTranslatedChorus = song.englishTranslatedChorus;
    let englishTranslatedVerses = song.englishTranslatedVerses;

    // Translate the title to English if not already translated
    if (!englishTranslatedTitle) {
      englishTranslatedTitle = await translate(song.title, { to: 'en' });
      song.englishTranslatedTitle = englishTranslatedTitle;
      song.markModified('englishTranslatedTitle');
    }

    // Translate the chorus to English if not already translated
    if (!englishTranslatedChorus || englishTranslatedChorus.length === 0) {
      englishTranslatedChorus = await Promise.all(song.chorus.map(async (line) => {
        try {
          const text = await translate(line, { to: 'en' });
          return text;
        } catch (err) {
          console.error("Error translating chorus line:", err);
          return line; // Return original line if translation fails
        }
      }));
      song.englishTranslatedChorus = englishTranslatedChorus;
      song.markModified('englishTranslatedChorus');
    }

    // Translate the verses to English (array of arrays) if not already translated
    if (!englishTranslatedVerses || englishTranslatedVerses.length === 0) {
      englishTranslatedVerses = await Promise.all(song.verses.map(async (verseArray) => {
        return await Promise.all(verseArray.map(async (verse) => {
          try {
            const text = await translate(verse, { to: 'en' });
            return text;
          } catch (err) {
            console.error("Error translating verse:", err);
            return verse; // Return original verse if translation fails
          }
        }));
      }));
      song.englishTranslatedVerses = englishTranslatedVerses;
      song.markModified('englishTranslatedVerses');
    }

    // Ensure the formatted field is set
    if (typeof song.formatted === 'undefined') {
      song.formatted = false; // or set it to a default value you want
    }

    await song.save();

    // Prepare the translated song object to return in the response
    const translatedSong = {
      _id: song._id,
      title: englishTranslatedTitle,
      chorus: englishTranslatedChorus,
      verses: englishTranslatedVerses,
      songID: song.songID,
      formatted: song.formatted // Include the formatted field in the response
    };

    // Return the translated song data
    res.json(translatedSong);
  } catch (err) {
    console.error("Error translating song:", err);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getArbSongs,
  createSong,
  getArbSongBySongID,
  getEnglishTranslation,
  searchForArbSong,
};
