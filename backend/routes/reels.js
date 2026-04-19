const express = require('express');
const router = express.Router();
const Reel = require('../models/Reel');

// @route   GET api/reels
// @desc    Get all reels
// @access  Public
router.get('/', async (req, res) => {
  try {
    const reels = await Reel.find().sort({ createdAt: -1 });
    res.json(reels);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/reels
// @desc    Add a new reel
// @access  Public (Should be protected in production)
router.post('/', async (req, res) => {
  const { title, category, videoUrl, thumbnailUrl } = req.body;

  try {
    const newReel = new Reel({
      title,
      category,
      videoUrl,
      thumbnailUrl
    });

    const reel = await newReel.save();
    res.json(reel);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
