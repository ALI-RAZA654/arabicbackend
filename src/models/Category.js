const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nameAr: { type: String, required: true },
  nameEn: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
