console.log("Starting server...");

require("dotenv").config();
const express = require("express");
const { sequelize, Track } = require("./database/setup");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Middleware to log every request
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ------------------------
// API Endpoints
// ------------------------

// GET all tracks
app.get("/api/tracks", async (req, res) => {
  try {
    const tracks = await Track.findAll();
    res.json(tracks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET track by id
app.get("/api/tracks/:id", async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ error: "Track not found" });
    res.json(track);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// POST create new track
app.post("/api/tracks", async (req, res) => {
  const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;

  if (!songTitle || !artistName || !albumName || !genre) {
    return res.status(400).json({ error: "songTitle, artistName, albumName, and genre are required" });
  }

  try {
    const newTrack = await Track.create({ songTitle, artistName, albumName, genre, duration, releaseYear });
    res.status(201).json(newTrack);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// PUT update track by id
app.put("/api/tracks/:id", async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ error: "Track not found" });

    await track.update(req.body);
    res.json(track);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE track by id
app.delete("/api/tracks/:id", async (req, res) => {
  try {
    const track = await Track.findByPk(req.params.id);
    if (!track) return res.status(404).json({ error: "Track not found" });

    await track.destroy();
    res.json({ message: "Track deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// ------------------------
// Start server
// ------------------------
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected.");
    await sequelize.sync();
    console.log("Tables ready.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Try visiting: http://localhost:${PORT}/api/tracks`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
  }
}

startServer();