const express = require('express');
const router = express.Router();
const path = require('path');
const upload = require('../../middleware/upload');
const { compressImage } = require('../../utils/imageCompress');
const authMiddleware = require('../../middleware/auth');

router.use(authMiddleware);

// POST /api/admin/upload → upload 1-5 images
router.post('/', upload.array('images', 5), async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images uploaded' });
    }

    const urls = [];
    for (const file of req.files) {
      const compressedPath = await compressImage(file);
      urls.push(`/uploads/${path.basename(compressedPath)}`);
    }

    res.json({ success: true, data: { urls } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
