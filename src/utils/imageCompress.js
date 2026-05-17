const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;

const compressImage = async (file) => {
  const { path: filePath, filename } = file;
  const targetPath = filePath.replace(path.extname(filePath), '.webp');

  await sharp(filePath)
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(targetPath);

  // Remove original file
  await fs.unlink(filePath);

  return targetPath;
};

module.exports = { compressImage };
