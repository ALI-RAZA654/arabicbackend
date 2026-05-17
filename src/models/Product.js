const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nameAr: { type: String, required: true },
  nameEn: { type: String, required: true },
  descriptionAr: { type: String },
  descriptionEn: { type: String },
  price: { type: Number, default: null },
  isVisible: { type: Boolean, default: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  images: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
