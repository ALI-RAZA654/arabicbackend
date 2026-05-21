const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
   showPrices: { type: Boolean, default: true },
   showOrderPrices: { type: Boolean, default: true },
  bannerTitleAr: { type: String },
  bannerTitleEn: { type: String },
  bannerSubtitleAr: { type: String },
  bannerSubtitleEn: { type: String },
  bannerMediaUrl: { type: String },
  bannerMediaType: { type: String, default: 'image' },
  aboutStoreAr: { type: String },
  aboutStoreEn: { type: String },
  // Footer fields
  footerPhone: { type: String, default: '+966 50 000 0000' },
  footerEmail: { type: String, default: 'info@freezedry.com' },
  footerAddressAr: { type: String, default: 'الرياض، المملكة العربية السعودية' },
  footerAddressEn: { type: String, default: 'Riyadh, Saudi Arabia' },
  footerCopyrightAr: { type: String, default: 'جميع الحقوق محفوظة © {year} فريز دراي.' },
  footerCopyrightEn: { type: String, default: 'All rights reserved © {year} Freeze Dry.' },
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);

