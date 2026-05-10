import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);

  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  async createNote(
    userId: string,
    imageUrls: string[],
    title?: string,
    subject?: string,
  ) {
    const note = await this.prisma.note.create({
      data: {
        userId,
        originalImages: imageUrls,
        title: title || '未命名笔记',
        subject,
        status: 'processing',
      },
    });

    // 异步处理：OCR + AI整理
    this.processNoteAsync(note.id).catch((err) =>
      console.error(`笔记处理失败 ${note.id}:`, err),
    );

    return {
      id: note.id,
      status: 'processing',
      message: '笔记正在处理中...',
    };
  }

  private async processNoteAsync(noteId: string) {
    try {
      const note = await this.prisma.note.findUnique({
        where: { id: noteId },
      });
      if (!note) return;

      // 第一步：OCR 识别图片中的文字
      this.logger.log(`[${noteId}] 开始OCR识别...`);
      const ocrText = await this.ai.ocrImages(note.originalImages);
      this.logger.log(
        `[${noteId}] OCR完成，识别 ${ocrText.length} 字`,
      );

      // 第二步：AI 整理笔记（基于图片内容生成结构化 Markdown）
      this.logger.log(`[${noteId}] 开始AI整理笔记...`);
      const markdownContent = await this.ai.analyzeImages(
        note.originalImages,
        [
          '请根据图片内容，整理出一份高质量的学习笔记。要求：',
          '1. 使用 Markdown 格式，层级清晰',
          '2. 提取核心知识点，按逻辑顺序排列',
          '3. 标注重点和难点',
          '4. 如果有公式，使用 LaTeX 格式（用 $ 或 $$ 包裹）',
          '5. 在末尾添加"重点总结"和"易错点"板块',
          '6. 语言与图片中的内容保持一致',
        ].join('\n'),
      );
      this.logger.log(`[${noteId}] AI整理完成`);

      await this.prisma.note.update({
        where: { id: noteId },
        data: {
          originalOcr: ocrText,
          markdownContent: markdownContent || ocrText,
          status: 'completed',
        },
      });
    } catch (err) {
      this.logger.error(`[${noteId}] 处理失败:`, err);
      await this.prisma.note
        .update({
          where: { id: noteId },
          data: { status: 'failed' },
        })
        .catch(() => {});
    }
  }

  async getNoteById(userId: string, noteId: string) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note) {
      throw new NotFoundException('笔记不存在');
    }
    if (note.userId !== userId) {
      throw new ForbiddenException('无权访问此笔记');
    }

    // 获取用户会员状态
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { membershipType: true, vipExpireAt: true },
    });

    const isVip =
      user?.membershipType === 'VIP' &&
      user.vipExpireAt &&
      new Date(user.vipExpireAt) > new Date();

    // 会员或已解锁 → 返回全文；否则返回预览
    if (isVip || !note.isLocked) {
      return {
        ...note,
        isLocked: false,
      };
    }

    // 非会员且未解锁：只返回前20%内容
    const lines = (note.markdownContent || '').split('\n');
    const previewLineCount = Math.max(1, Math.floor(lines.length * 0.2));
    const previewContent = lines.slice(0, previewLineCount).join('\n');

    return {
      id: note.id,
      userId: note.userId,
      title: note.title,
      subject: note.subject,
      originalImages: note.originalImages,
      markdownContent: previewContent,
      isLocked: true,
      status: note.status,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    };
  }

  async unlockNote(userId: string, noteId: string) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note || note.userId !== userId) {
      throw new NotFoundException('笔记不存在');
    }

    // 检查今日广告观看次数（免费用户3次/天）
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { membershipType: true, vipExpireAt: true },
    });

    const isVip =
      user?.membershipType === 'VIP' &&
      user.vipExpireAt &&
      new Date(user.vipExpireAt) > new Date();

    if (!isVip) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const adCount = await this.prisma.adWatchLog.count({
        where: {
          userId,
          adType: 'note_unlock',
          watchedAt: { gte: todayStart },
        },
      });

      if (adCount >= 3) {
        throw new ForbiddenException('今日免费解锁次数已用完（3次/天）');
      }

      // 记录广告观看
      await this.prisma.adWatchLog.create({
        data: { userId, adType: 'note_unlock' },
      });
    }

    // 解锁笔记
    await this.prisma.note.update({
      where: { id: noteId },
      data: { isLocked: false },
    });

    return { message: '笔记已解锁' };
  }

  async listNotes(
    userId: string,
    page = 1,
    pageSize = 20,
    subject?: string,
  ) {
    const where: any = { userId };
    if (subject) {
      where.subject = subject;
    }

    const [notes, total] = await Promise.all([
      this.prisma.note.findMany({
        where,
        select: {
          id: true,
          title: true,
          subject: true,
          isLocked: true,
          status: true,
          createdAt: true,
          originalImages: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.note.count({ where }),
    ]);

    return {
      list: notes,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async deleteNote(userId: string, noteId: string) {
    const note = await this.prisma.note.findUnique({
      where: { id: noteId },
    });

    if (!note || note.userId !== userId) {
      throw new NotFoundException('笔记不存在');
    }

    await this.prisma.note.delete({ where: { id: noteId } });
    return { message: '笔记已删除' };
  }
}
