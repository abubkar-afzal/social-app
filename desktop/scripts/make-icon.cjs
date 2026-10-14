const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// __dirname = C:\current work\social-app\desktop\scripts
// ..        = C:\current work\social-app\desktop
// ..\..     = C:\current work\social-app
// ..\..\apps\mobile\assets\my_logo.jpg

const SOURCE = path.join(
  __dirname,
  '..',
  '..',
  'apps',
  'mobile',
  'assets',
  'my_logo.jpg'
);

const OUT = path.join(__dirname, '..', 'build', 'icon.ico');

console.log('Source:', SOURCE);
console.log('Output:', OUT);

if (!fs.existsSync(SOURCE)) {
  console.error('❌ Source image not found:', SOURCE);
  console.error('   Looked for: apps/mobile/assets/my_logo.jpg');
  process.exit(1);
}

// Electron-builder requires a multi-size ICO with at least 256x256.
// We build a 256x256 PNG, then hand it to a small ICO encoder.
sharp(SOURCE)
  .resize(256, 256, { fit: 'cover' })
  .png()
  .toBuffer()
  .then(async (pngBuffer) => {
    // Wrap the PNG into a minimal ICO container.
    // The ICO header is 6 bytes, then one 16-byte directory entry,
    // then the PNG data. This is valid for Windows and works for
    // all sizes when the PNG is 256x256.
    const ico = createIcoFromPng(pngBuffer, 256, 256);
    fs.writeFileSync(OUT, ico);
    const size = fs.statSync(OUT).size;
    console.log(`✅ icon.ico created (${size} bytes) at ${OUT}`);
  })
  .catch((err) => {
    console.error('❌', err);
    process.exit(1);
  });

/**
 * Minimal ICO writer: header + one directory entry + PNG data.
 */
function createIcoFromPng(pngBuffer, width, height) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);        // reserved
  header.writeUInt16LE(1, 2);        // type: 1 = ICO
  header.writeUInt16LE(1, 4);        // number of images

  const dir = Buffer.alloc(16);
  // For 256x256, the width and height bytes must be 0 (means 256).
  dir.writeUInt8(width === 256 ? 0 : width, 0);
  dir.writeUInt8(height === 256 ? 0 : height, 1);
  dir.writeUInt8(0, 2);              // color palette count
  dir.writeUInt8(0, 3);              // reserved
  dir.writeUInt16LE(1, 4);           // color planes
  dir.writeUInt16LE(32, 6);          // bits per pixel
  dir.writeUInt32LE(pngBuffer.length, 8);  // size of image data
  dir.writeUInt32LE(22, 12);         // offset (6 + 16 = 22)

  return Buffer.concat([header, dir, pngBuffer]);
}