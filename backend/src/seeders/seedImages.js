const fs = require("fs");
const path = require("path");

const IMAGE_EXT = /\.(jpe?g|png|webp|gif)$/i;

const DEFAULT_IMAGE_FILES = [
  "1770343838337_19da6f8b22143337.jpg",
  "1770346011540_4c8e446f5c206a5c.jpg",
  "1770520385517_fd28f5acc6a661e7.jpg",
  "1770520399318_1891cdfba0a17108.png",
  "1770520513218_e8a93243597ee9e4.jpeg",
  "1770520523395_59e6e86481526b71.jpg",
  "1770520534939_7bd18566226759d9.jpeg",
  "1770520553392_16692930c999d9a7.jpg",
  "1770520567352_14f24a29e59b8200.jpg",
];

const loadUploadFiles = () => {
  const uploadsDir = path.resolve(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) return [];

  try {
    return fs.readdirSync(uploadsDir).filter((name) => IMAGE_EXT.test(name));
  } catch {
    return [];
  }
};

const seedFiles = (() => {
  const files = loadUploadFiles();
  return files.length > 0 ? files : DEFAULT_IMAGE_FILES;
})();

const seedPaths = seedFiles.map((file) => `/uploads/${file}`);

const getSeedImages = (index = 0, count = 1) => {
  if (seedPaths.length === 0) return [];
  const size = Math.max(1, count);
  const start = Math.max(0, index);
  const images = [];

  for (let i = 0; i < size; i++) {
    images.push(seedPaths[(start + i) % seedPaths.length]);
  }

  return images;
};

module.exports = {
  getSeedImages,
};
