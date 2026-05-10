// Generate simple but valid PNG tab bar icons
const fs = require('fs');
const path = require('path');

// Minimal PNG encoder - creates 81x81 icon with simple shapes
function createPNG(width, height, drawFunc) {
  const pixels = Buffer.alloc(width * height * 4, 0); // RGBA
  drawFunc(pixels, width, height);
  
  // PNG signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  
  // IHDR chunk
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type (RGBA)
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdr = createChunk('IHDR', ihdrData);
  
  // IDAT chunk - raw pixel data with zlib
  const rawData = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    rawData[y * (1 + width * 4)] = 0; // filter none
    pixels.copy(rawData, y * (1 + width * 4) + 1, y * width * 4, (y + 1) * width * 4);
  }
  const zlib = require('zlib');
  const compressed = zlib.deflateSync(rawData);
  const idat = createChunk('IDAT', compressed);
  
  // IEND chunk
  const iend = createChunk('IEND', Buffer.alloc(0));
  
  return Buffer.concat([signature, ihdr, idat, iend]);
}

function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typeBuffer = Buffer.from(type, 'ascii');
  const crcData = Buffer.concat([typeBuffer, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(crcData), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let j = 0; j < 8; j++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xEDB88320 : 0);
    }
  }
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function setPixel(pixels, w, x, y, r, g, b, a) {
  if (x < 0 || x >= w || y < 0 || y >= w) return;
  const idx = (y * w + x) * 4;
  // Alpha blend
  const srcA = a / 255;
  const dstA = pixels[idx + 3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA > 0) {
    pixels[idx] = Math.round((r * srcA + pixels[idx] * dstA * (1 - srcA)) / outA);
    pixels[idx + 1] = Math.round((g * srcA + pixels[idx + 1] * dstA * (1 - srcA)) / outA);
    pixels[idx + 2] = Math.round((b * srcA + pixels[idx + 2] * dstA * (1 - srcA)) / outA);
    pixels[idx + 3] = Math.round(outA * 255);
  }
}

function drawCircle(pixels, w, cx, cy, r, cr, cg, cb, ca, filled) {
  for (let y = -r - 1; y <= r + 1; y++) {
    for (let x = -r - 1; x <= r + 1; x++) {
      const dist = Math.sqrt(x * x + y * y);
      if (filled) {
        if (dist <= r + 0.5) {
          const alpha = Math.max(0, Math.min(1, r + 0.5 - dist));
          setPixel(pixels, w, cx + x, cy + y, cr, cg, cb, Math.round(ca * alpha));
        }
      } else {
        const thickness = 2.5;
        const outer = r + thickness / 2;
        const inner = r - thickness / 2;
        if (dist <= outer + 0.5 && dist >= inner - 0.5) {
          const alphaOuter = Math.max(0, Math.min(1, outer + 0.5 - dist));
          const alphaInner = Math.max(0, Math.min(1, dist - inner + 0.5));
          const alpha = Math.min(alphaOuter, alphaInner);
          setPixel(pixels, w, cx + x, cy + y, cr, cg, cb, Math.round(ca * alpha));
        }
      }
    }
  }
}

function drawLine(pixels, w, x1, y1, x2, y2, cr, cg, cb, ca, thickness) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.max(Math.ceil(len * 3), 1);
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const cx = x1 + dx * t;
    const cy = y1 + dy * t;
    drawCircle(pixels, w, Math.round(cx), Math.round(cy), thickness / 2, cr, cg, cb, ca, true);
  }
}

function drawRect(pixels, w, x, y, rw, rh, cr, cg, cb, ca, thickness) {
  drawLine(pixels, w, x, y, x + rw, y, cr, cg, cb, ca, thickness);
  drawLine(pixels, w, x + rw, y, x + rw, y + rh, cr, cg, cb, ca, thickness);
  drawLine(pixels, w, x + rw, y + rh, x, y + rh, cr, cg, cb, ca, thickness);
  drawLine(pixels, w, x, y + rh, x, y, cr, cg, cb, ca, thickness);
}

const SIZE = 81;
const staticDir = path.join(__dirname, 'src', 'static');

// Color definitions
const GRAY = [77, 84, 102];
const BLUE = [91, 123, 255];

const icons = {
  'tab-home': (p, w, h, color) => {
    const [r, g, b] = color;
    // House shape
    drawLine(p, w, 40, 15, 15, 38, r, g, b, 255, 3);
    drawLine(p, w, 40, 15, 65, 38, r, g, b, 255, 3);
    drawRect(p, w, 20, 38, 40, 27, r, g, b, 255, 3);
    drawRect(p, w, 32, 48, 16, 17, r, g, b, 255, 3);
  },
  'tab-notes': (p, w, h, color) => {
    const [r, g, b] = color;
    // Document
    drawRect(p, w, 18, 10, 44, 56, r, g, b, 255, 3);
    drawLine(p, w, 28, 25, 52, 25, r, g, b, 255, 2.5);
    drawLine(p, w, 28, 35, 52, 35, r, g, b, 255, 2.5);
    drawLine(p, w, 28, 45, 44, 45, r, g, b, 255, 2.5);
  },
  'tab-practice': (p, w, h, color) => {
    const [r, g, b] = color;
    // Target
    drawCircle(p, w, 40, 40, 28, r, g, b, 255, false);
    drawCircle(p, w, 40, 40, 18, r, g, b, 255, false);
    drawCircle(p, w, 40, 40, 8, r, g, b, 255, false);
    drawCircle(p, w, 40, 40, 2, r, g, b, 255, true);
  },
  'tab-mistakes': (p, w, h, color) => {
    const [r, g, b] = color;
    // Pencil edit icon
    drawLine(p, w, 15, 62, 50, 15, r, g, b, 255, 3);
    drawLine(p, w, 50, 15, 62, 27, r, g, b, 255, 3);
    drawLine(p, w, 62, 27, 27, 62, r, g, b, 255, 3);
    drawLine(p, w, 27, 62, 15, 62, r, g, b, 255, 3);
    drawLine(p, w, 12, 68, 12, 56, r, g, b, 255, 3);
  },
  'tab-profile': (p, w, h, color) => {
    const [r, g, b] = color;
    // Person
    drawCircle(p, w, 40, 22, 12, r, g, b, 255, false);
    // Body arc
    for (let angle = 0; angle <= 180; angle++) {
      const rad = angle * Math.PI / 180;
      const x = 40 + Math.cos(rad) * 24;
      const y = 50 + Math.sin(rad) * 18;
      drawCircle(p, w, Math.round(x), Math.round(y), 1.2, r, g, b, 255, true);
    }
  },
};

for (const [name, drawFn] of Object.entries(icons)) {
  // Normal (gray)
  const normalPng = createPNG(SIZE, SIZE, (p, w, h) => drawFn(p, w, h, GRAY));
  fs.writeFileSync(path.join(staticDir, `${name}.png`), normalPng);
  
  // Active (blue)
  const activePng = createPNG(SIZE, SIZE, (p, w, h) => drawFn(p, w, h, BLUE));
  fs.writeFileSync(path.join(staticDir, `${name}-active.png`), activePng);
}

console.log('Tab icons generated successfully!');
