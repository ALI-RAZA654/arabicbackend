const express = require('express');
const router = express.Router();
const Settings = require('../../models/Settings');
const authMiddleware = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const path = require('path');

router.use(authMiddleware);

// PUT /api/admin/settings
router.put('/', async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    await settings.save();
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings Update Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/settings/banner-upload
router.post('/banner-upload', upload.single('media'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    
    // For videos, we don't compress. For images, we could. 
    // Assuming simple move for now or compress if it's an image.
    let mediaUrl = `/uploads/${req.file.filename}`;
    
    const settings = await Settings.findOne();
    if (settings) {
      settings.bannerMediaUrl = mediaUrl;
      await settings.save();
    }

    res.json({ success: true, data: { url: mediaUrl } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
