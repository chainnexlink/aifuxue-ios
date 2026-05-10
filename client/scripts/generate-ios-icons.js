/**
 * iOS App Icon Generator
 * 生成 iOS 应用所需的全部图标尺寸
 * 使用 Canvas API 绘制渐变背景 + "爱" 字
 */
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../src/static/icons/ios');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// iOS 所需的所有图标尺寸
const sizes = [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180, 1024];

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');

  // 渐变背景 (与应用主题一致)
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#3D56C6');
  gradient.addColorStop(1, '#5B7BFF');
  ctx.fillStyle = gradient;

  // 圆角矩形 (iOS 会自动裁剪，但填满即可)
  ctx.fillRect(0, 0, size, size);

  // 绘制 "爱" 字
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const fontSize = Math.round(size * 0.52);
  ctx.font = `bold ${fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`;
  ctx.fillText('爱', size / 2, size / 2 + size * 0.02);

  // 保存
  const buffer = canvas.toBuffer('image/png');
  const filePath = path.join(outputDir, `icon-${size}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated: icon-${size}.png`);
}

sizes.forEach(generateIcon);
console.log(`\nAll ${sizes.length} icons generated in: ${outputDir}`);
