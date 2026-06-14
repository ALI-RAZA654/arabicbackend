const express = require('express');
const router = express.Router();
const Settings = require('../../models/Settings');

// GET /api/settings → get public store settings
router.get('/', async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default if not exists
      settings = await Settings.create({
        showPrices: true,
        bannerTitleAr: "تجربة التجميد الفاخرة",
        bannerTitleEn: "The Luxury Freeze Dry Experience"
      });
    }
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Settings Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
