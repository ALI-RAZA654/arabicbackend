const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');
const Product = require('../../models/Product');
const authMiddleware = require('../../middleware/auth');

router.use(authMiddleware);

// POST /api/admin/categories
router.post('/', async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/categories/:id
router.put('/:id', async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/categories/:id
router.delete('/:id', async (req, res, next) => {
  try {
    // Check if products are linked
    const productsCount = await Product.countDocuments({ category: req.params.id });
    if (productsCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete category with linked products' 
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
    
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
