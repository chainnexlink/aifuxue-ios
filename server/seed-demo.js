// 演示/审核用测试账号种子脚本
// 使用方法: node seed-demo.js
// 用途: 在 Apple App Store 审核前运行，确保测试账号可正常登录
// 测试账号: 13800138000，验证码: 000000

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const phone = '13800138000';

  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing) {
    console.log(`演示账号 ${phone} 已存在，跳过创建`);
    console.log(`  角色: ${existing.role}, 昵称: ${existing.nickname}`);
    return;
  }

  const user = await prisma.user.create({
    data: {
      phone,
      nickname: '审核测试',
      role: 'student',
      gradeLevel: 'JUNIOR',
      province: '广东',
      city: '潮州',
    },
  });

  console.log(`演示账号创建成功: ${user.phone} (${user.nickname})`);
  console.log(`  ID: ${user.id}`);
  console.log(`  登录方式: 手机号 ${phone} + 验证码 000000`);
}

main()
  .catch((e) => {
    console.error('种子脚本失败:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
