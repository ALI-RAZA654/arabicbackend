const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerPhone: { type: String, required: true },
  customerAddress: { type: String },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING','CONFIRMED','DELIVERED','CANCELLED'], 
    default: 'PENDING' 
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    nameAr: String,
    nameEn: String,
    price: Number,
    qty: Number,
    image: String
  }],
  language: { type: String, enum: ['ar','en'], default: 'ar' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
