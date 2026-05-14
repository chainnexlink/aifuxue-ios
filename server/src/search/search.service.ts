import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SearchResult {
  id: string;
  type: 'note' | 'mistake' | 'homework' | 'grade' | 'student';
  title: string;
  subtitle: string;
  path: string;
}

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(userId: string, keyword: string, role: string): Promise<{ results: SearchResult[] }> {
    const results: SearchResult[] = [];

    if (role === 'student') {
      // 搜索笔记
      const notes = await this.prisma.note.findMany({
        where: {
          userId,
          OR: [
            { title: { contains: keyword, mode: 'insensitive' } },
            { subject: { contains: keyword, mode: 'insensitive' } },
            { markdownContent: { contains: keyword, mode: 'insensitive' } },
          ],
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
      for (const n of notes) {
        results.push({
          id: n.id,
          type: 'note',
          title: n.title || '未命名笔记',
          subtitle: `${n.subject || ''}`,
          path: `/pages/notes/detail/index?id=${n.id}`,
        });
      }

      // 搜索错题
      const mistakes = await this.prisma.mistake.findMany({
        where: {
          userId,
          OR: [
            { subject: { contains: keyword, mode: 'insensitive' } },
            { ocrText: { contains: keyword, mode: 'insensitive' } },
            { knowledgePoint: { contains: keyword, mode: 'insensitive' } },
          ],
        },
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
      for (const m of mistakes) {
        results.push({
          id: m.id,
          type: 'mistake',
          title: m.knowledgePoint || m.subject || '错题',
          subtitle: m.subject || '',
          path: `/pages/mistakes/detail/index?id=${m.id}`,
        });
      }
    }

    if (role === 'teacher') {
      // 搜索学生
      const students = await this.prisma.user.findMany({
        where: {
          referredByTeacherId: userId,
          OR: [
            { nickname: { contains: keyword, mode: 'insensitive' } },
            { phone: { contains: keyword, mode: 'insensitive' } },
          ],
        },
        take: 5,
      });
      for (const s of students) {
        results.push({
          id: s.id,
          type: 'student',
          title: s.nickname || '未命名学生',
          subtitle: s.phone ? `${s.phone.slice(0, 3)}****${s.phone.slice(-4)}` : '',
          path: '',
        });
      }
    }

    return { results };
  }
}
