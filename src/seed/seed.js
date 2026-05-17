require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Admin = require('../models/Admin');
const Settings = require('../models/Settings');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Admin.deleteMany({});
    await Settings.deleteMany({});

    // Seed Categories
    const categories = await Category.insertMany([
      { nameAr: "شوكولاتة مجففة", nameEn: "Freeze Dried Chocolate", slug: "chocolate" },
      { nameAr: "فواكه مجففة",    nameEn: "Freeze Dried Fruits",    slug: "fruits" },
      { nameAr: "حلويات",         nameEn: "Sweets & Candy",         slug: "sweets" },
      { nameAr: "هدايا",          nameEn: "Gift Sets",               slug: "gifts" }
    ]);

    // Seed Products
    const sampleProducts = [
      {
        nameAr: "فراولة بالشوكولاتة",
        nameEn: "Chocolate Covered Strawberries",
        descriptionAr: "فراولة طازجة مجففة بالتجميد ومغطاة بالشوكولاتة الفاخرة",
        descriptionEn: "Fresh strawberries freeze-dried and covered in premium chocolate",
        price: 45,
        category: categories[0]._id,
        isVisible: true,
        images: ["https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=800"]
      },
      {
        nameAr: "مانجو مقرمش",
        nameEn: "Crispy Mango",
        descriptionAr: "شرائح مانجو طبيعية 100% مجففة بالتجميد",
        descriptionEn: "100% natural freeze-dried mango slices",
        price: 35,
        category: categories[1]._id,
        isVisible: true,
        images: ["https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&q=80&w=800"]
      },
      {
        nameAr: "سكيتلز مقرمش",
        nameEn: "Crunchy Skittles",
        descriptionAr: "حلوى سكيتلز الشهيرة بقوام مقرمش فريد",
        descriptionEn: "Famous Skittles with a unique crunchy texture",
        price: 25,
        category: categories[2]._id,
        isVisible: true,
        images: ["https://images.unsplash.com/photo-1533910534207-90f31029a78e?auto=format&fit=crop&q=80&w=800"]
      },
      {
        nameAr: "صندوق الهدايا الفاخر",
        nameEn: "Luxury Gift Box",
        descriptionAr: "مجموعة مختارة من أفضل منتجاتنا في صندوق خشبي فاخر",
        descriptionEn: "A selection of our best products in a luxury wooden box",
        price: 150,
        category: categories[3]._id,
        isVisible: true,
        images: ["https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800"]
      }
    ];
    await Product.insertMany(sampleProducts);

    // Seed Admin
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'freezedry2025', salt);
    await Admin.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      passwordHash
    });

    // Seed Settings
    await Settings.create({
      showPrices: true,
      bannerTitleAr: "تجربة التجميد الفاخرة",
      bannerTitleEn: "The Luxury Freeze Dry Experience",
      bannerSubtitleAr: "حلويات وفواكه مجففة بالتجميد بجودة استثنائية",
      bannerSubtitleEn: "Premium freeze-dried sweets and fruits"
    });

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seed();
