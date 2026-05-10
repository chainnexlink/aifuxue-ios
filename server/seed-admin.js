// 管理员种子脚本 - 生成默认超级管理员
// 使用方法: node seed-admin.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const username = 'admin';
  const password = 'admin123';

  const existing = await prisma.admin.findUnique({ where: { username } });
  if (existing) {
    console.log(`管理员 ${username} 已存在，跳过`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      username,
      passwordHash,
      name: '超级管理员',
      role: 'SUPER_ADMIN',
    },
  });

  console.log(`管理员创建成功: ${admin.username} (${admin.name})`);
}

main()
  .catch((e) => {
    console.error('种子脚本失败:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
