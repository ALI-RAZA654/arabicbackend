const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const Product = require('../../models/Product');

// GET /api/categories → list all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: categories || [] });
  } catch (error) {
    console.error('Categories Fetch Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/categories/:slug → single category + its products
router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const products = await Product.find({ category: category._id, isVisible: true });
    res.json({ success: true, data: { category, products } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
