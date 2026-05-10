import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebsiteService {
  constructor(private prisma: PrismaService) {}

  // 获取某个 section 的所有内容
  async getSection(section: string) {
    return this.prisma.webContent.findMany({
      where: { section, isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  // 获取所有 section（admin用）
  async getAllSections() {
    const items = await this.prisma.webContent.findMany({
      orderBy: [{ section: 'asc' }, { sortOrder: 'asc' }],
    });
    // 按 section 分组
    const grouped: Record<string, any[]> = {};
    for (const item of items) {
      if (!grouped[item.section]) grouped[item.section] = [];
      grouped[item.section].push(item);
    }
    return grouped;
  }

  // 获取单个内容项
  async getItem(section: string, key: string) {
    const item = await this.prisma.webContent.findUnique({
      where: { section_key: { section, key } },
    });
    if (!item) throw new NotFoundException('内容不存在');
    return item;
  }

  // 创建或更新内容（upsert）
  async upsertItem(data: {
    section: string;
    key: string;
    title?: string;
    content: any;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    return this.prisma.webContent.upsert({
      where: { section_key: { section: data.section, key: data.key } },
      create: {
        section: data.section,
        key: data.key,
        title: data.title,
        content: data.content,
        sortOrder: data.sortOrder ?? 0,
        isActive: data.isActive ?? true,
      },
      update: {
        title: data.title,
        content: data.content,
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      },
    });
  }

  // 批量更新某个 section
  async batchUpsertSection(section: string, items: { key: string; title?: string; content: any; sortOrder?: number; isActive?: boolean }[]) {
    const results: any[] = [];
    for (const item of items) {
      const result = await this.upsertItem({ section, ...item });
      results.push(result);
    }
    return results;
  }

  // 删除内容项
  async deleteItem(id: string) {
    return this.prisma.webContent.delete({ where: { id } });
  }

  // 切换启用状态
  async toggleActive(id: string) {
    const item = await this.prisma.webContent.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('内容不存在');
    return this.prisma.webContent.update({
      where: { id },
      data: { isActive: !item.isActive },
    });
  }

  // 初始化默认内容（首次部署时调用）
  async initDefaultContent() {
    const count = await this.prisma.webContent.count();
    if (count > 0) return { message: '内容已存在，跳过初始化' };

    const defaults = [
      { section: 'hero', key: 'main', title: '首页Banner', sortOrder: 0, content: { badge: 'AI 驱动的智能学习助手', heading: '拍照整理笔记\nAI诊断错题\n让学习更高效', description: '爱辅学利用AI技术，帮助学生拍照整理笔记、智能诊断错题、生成靶向练习。教师可创建班级、发布作业、AI自动批改。邀请码获客，人人受益。' } },
      { section: 'stats', key: 'users', title: '注册用户', sortOrder: 0, content: { value: '12,000+', label: '注册用户' } },
      { section: 'stats', key: 'teachers', title: '认证教师', sortOrder: 1, content: { value: '500+', label: '认证教师' } },
      { section: 'stats', key: 'classes', title: '活跃班级', sortOrder: 2, content: { value: '1,200+', label: '活跃班级' } },
      { section: 'stats', key: 'grading', title: 'AI批改次数', sortOrder: 3, content: { value: '126,000+', label: 'AI批改次数' } },
      { section: 'testimonials', key: 'student1', title: '张同学', sortOrder: 0, content: { name: '张同学', role: '高二学生', text: '用爱辅学整理笔记太方便了，拍一张照片就能生成完美的电子版，还能直接生成练习题！', color: '#5B7BFF' } },
      { section: 'testimonials', key: 'parent1', title: '李妈妈', sortOrder: 1, content: { name: '李妈妈', role: '家长', text: '家长控制功能很贴心，可以设置使用时长，每周还能收到学习报告，放心让孩子使用。', color: '#A78BFA' } },
      { section: 'testimonials', key: 'teacher1', title: '赵老师', sortOrder: 2, content: { name: '赵老师', role: '数学教师', text: '班级管理和AI批改太好用了，以前批30份作业要2小时，现在10分钟搞定，教学效率翻倍！', color: '#FFBA4A' } },
      { section: 'testimonials', key: 'student2', title: '王同学', sortOrder: 3, content: { name: '王同学', role: '初三学生', text: '老师用邀请码让全班加入，作业在线提交AI自动批改，再也不用担心作业忘带了！', color: '#34D399' } },
      { section: 'about', key: 'company', title: '公司信息', sortOrder: 0, content: { name: '爱辅学', email: 'support@aifuxue.cn', phone: '400-800-XXXX', wechat: '爱辅学', address: '中国北京市' } },
    ];

    for (const item of defaults) {
      await this.prisma.webContent.create({ data: item });
    }
    return { message: `初始化完成，已创建 ${defaults.length} 条内容` };
  }
}
