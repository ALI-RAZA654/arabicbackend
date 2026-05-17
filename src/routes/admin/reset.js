const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Category = require('../../models/Category');
const Product = require('../../models/Product');
const Order = require('../../models/Order');
const Admin = require('../../models/Admin');
const authMiddleware = require('../../middleware/auth');

router.use(authMiddleware);

// POST /api/admin/reset → factory reset
router.post('/', async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, message: 'Password confirmation required' });
    }

    const admin = await Admin.findById(req.admin.id);
    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Factory reset: Deletes all products, orders, categories — keeps admin + settings
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});

    res.json({ success: true, message: 'Factory reset successful. All products, categories, and orders have been deleted.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
