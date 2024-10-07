const express = require('express');
const mongoose = require('mongoose'); // Import mongoose
const cors = require('cors'); // Import cors

const app = express();
const connectDB = require('./config/db'); // Adjust path as per your file structure

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json()); // Body parser middleware

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000'
}));

// Routes
const arbSongRoutes = require('./routes/arbSongRoutes');
const frankSongRoutes = require('./routes/frankSongRoutes');

app.use('/api/ArbSongs', arbSongRoutes);
app.use('/api/FrankSongs', frankSongRoutes);

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// Optional: Listen for MongoDB connection success
mongoose.connection.once("open", () => {
  console.log("MongoDB connected successfully");
});
