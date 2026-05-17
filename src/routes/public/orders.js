const express = require('express');
const router = express.Router();
const Order = require('../../models/Order');
const Joi = require('joi');
const validateRequest = require('../../middleware/validateRequest');

const orderSchema = Joi.object({
  customerName: Joi.string().required(),
  customerPhone: Joi.string().required(),
  customerAddress: Joi.string().allow(''),
  totalAmount: Joi.number().required(),
  items: Joi.array().items(Joi.object({
    productId: Joi.string().required(),
    nameAr: Joi.string().required(),
    nameEn: Joi.string().required(),
    price: Joi.number().required(),
    qty: Joi.number().required(),
    image: Joi.string().allow('')
  })).min(1).required(),
  language: Joi.string().valid('ar', 'en').default('ar')
});

// POST /api/orders → create new order
router.post('/', validateRequest(orderSchema), async (req, res, next) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id → get single order
router.get('/:id', async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
