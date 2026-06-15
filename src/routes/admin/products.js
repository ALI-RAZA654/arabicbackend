const express = require('express');
const router = express.Router();
const path = require('path');
const Product = require('../../models/Product');
const authMiddleware = require('../../middleware/auth');
const upload = require('../../middleware/upload');
const { compressImage } = require('../../utils/imageCompress');

// All routes here require auth
router.use(authMiddleware);

// GET /api/admin/products
router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find().populate('category').sort({ createdAt: -1 });
    res.json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/products
router.post('/', upload.array('images', 5), async (req, res, next) => {
  try {
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const compressedPath = await compressImage(file);
        imageUrls.push(`/uploads/${path.basename(compressedPath)}`);
      }
    } else if (req.body.images) {
      if (Array.isArray(req.body.images)) {
        imageUrls.push(...req.body.images);
      } else if (typeof req.body.images === 'string') {
        imageUrls.push(req.body.images);
      }
    }

    const product = new Product({
      ...req.body,
      images: imageUrls
    });
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id
router.put('/:id', upload.array('images', 5), async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    
    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        const compressedPath = await compressImage(file);
        newImages.push(`/uploads/${path.basename(compressedPath)}`);
      }
      updateData.images = newImages; 
    } else if (req.body.images) {
      if (Array.isArray(req.body.images)) {
        updateData.images = req.body.images;
      } else if (typeof req.body.images === 'string') {
        updateData.images = [req.body.images];
      }
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/admin/products/:id/visibility
router.patch('/:id/visibility', async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    
    product.isVisible = !product.isVisible;
    await product.save();
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/products/:id
router.delete('/:id', async (req, res, next) => {
  try {
    console.log('Deleting product ID:', req.params.id);
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('DELETE Product ERROR:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
