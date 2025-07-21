// server.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

console.log("Mongo URI:", process.env.MONGO_URI);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Schema and Model
const timeSchema = new mongoose.Schema({
  url: String,
  timeSpent: Number,
  category: String, // "productive" or "unproductive"
  timestamp: { type: Date, default: Date.now }
});

const TimeEntry = mongoose.model('TimeEntry', timeSchema);

// Routes
app.post('/api/track', async (req, res) => {
  try {
    const { url, timeSpent, category } = req.body;
    const entry = new TimeEntry({ url, timeSpent, category });
    await entry.save();
    res.status(201).json({ message: 'Time entry saved' });
  } catch (err) {
    res.status(500).json({ error: 'Error saving time entry' });
  }
});

app.get('/api/analytics', async (req, res) => {
  try {
    const data = await TimeEntry.aggregate([
      {
        $group: {
          _id: "$category",
          totalTime: { $sum: "$timeSpent" }
        }
      }
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Error retrieving analytics' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
