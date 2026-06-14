const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const authMiddleware = require('../../middleware/auth');

router.use(authMiddleware);

// GET /api/admin/orders
router.get('/', async (req, res, next) => {
  try {
    const { status } = req.query;
    const query = {};
    if (status) query.status = status;

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    
    // Ensure every order has defaults to avoid frontend crashes
    const safeOrders = orders.map(order => ({
      ...order,
      customerAddress: order.customerAddress || '',
      items: order.items || [],
      status: order.status || 'PENDING'
    }));

    res.json({ success: true, data: safeOrders });
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/orders/:id/status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELLED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/orders/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
