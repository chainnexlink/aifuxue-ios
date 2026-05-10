import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        phone: true,
        nickname: true,
        avatar: true,
        gradeLevel: true,
        province: true,
        city: true,
        membershipType: true,
        vipExpireAt: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    // 判断VIP是否过期
    const isVip =
      user.membershipType === 'VIP' &&
      user.vipExpireAt &&
      new Date(user.vipExpireAt) > new Date();

    return {
      ...user,
      isVip,
      hasParentPassword: !!(await this.prisma.user.findUnique({
        where: { id: userId },
        select: { parentPasswordHash: true },
      }))?.parentPasswordHash,
    };
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
      select: {
        id: true,
        phone: true,
        nickname: true,
        avatar: true,
        gradeLevel: true,
        province: true,
        city: true,
        membershipType: true,
      },
    });
    return user;
  }

  async getStats(userId: string) {
    const [noteCount, exerciseCount, mistakeKilled, streakDays] =
      await Promise.all([
        this.prisma.note.count({
          where: { userId, status: 'completed' },
        }),
        this.prisma.exerciseAttempt.count({
          where: { userId },
        }),
        this.prisma.mistake.count({
          where: { userId, status: 'completed' },
        }),
        this.calculateStreak(userId),
      ]);

    return { noteCount, exerciseCount, mistakeKilled, streakDays };
  }

  async getBadges(userId: string) {
    const [noteCount, exerciseAttempts, mistakeKilled, maxScore] =
      await Promise.all([
        this.prisma.note.count({ where: { userId, status: 'completed' } }),
        this.prisma.exerciseAttempt.count({ where: { userId } }),
        this.prisma.mistake.count({ where: { userId, status: 'completed' } }),
        this.prisma.exerciseAttempt.aggregate({
          where: { userId },
          _max: { score: true },
        }),
      ]);

    const streak = await this.calculateStreak(userId);
    const highScore = maxScore._max.score || 0;

    return [
      { id: 'first_note', name: '初来乍到', desc: '完成首次笔记', icon: '📝', color: 'bg-blue', earned: noteCount >= 1 },
      { id: 'streak_7', name: '打卡7天', desc: '连续使用7天', icon: '7️⃣', color: 'bg-green', earned: streak >= 7 },
      { id: 'mistake_killer', name: '错题杀手', desc: '消灭100道错题', icon: '💀', color: 'bg-red', earned: mistakeKilled >= 100 },
      { id: 'exam_master', name: '模考达人', desc: '模拟考试3次', icon: '🏆', color: 'bg-purple', earned: exerciseAttempts >= 3 },
      { id: 'streak_30', name: '打卡30天', desc: '连续使用30天', icon: '🔥', color: 'bg-orange', earned: streak >= 30 },
      { id: 'top_scorer', name: '学霸认证', desc: '模考得分90+', icon: '⭐', color: 'bg-gold', earned: highScore >= 90 },
    ];
  }

  async getTodayStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [notes, exercises, mistakes] = await Promise.all([
      this.prisma.note.count({
        where: { userId, createdAt: { gte: today } },
      }),
      this.prisma.exerciseAttempt.count({
        where: { userId, submittedAt: { gte: today } },
      }),
      this.prisma.mistake.count({
        where: { userId, status: { not: 'completed' } },
      }),
    ]);

    return { notes, exercises, mistakes };
  }

  private async calculateStreak(userId: string): Promise<number> {
    // 获取最近60天的活动记录来计算连续天数
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const [notesDates, attemptsDates] = await Promise.all([
      this.prisma.note.findMany({
        where: { userId, createdAt: { gte: sixtyDaysAgo } },
        select: { createdAt: true },
      }),
      this.prisma.exerciseAttempt.findMany({
        where: { userId, submittedAt: { gte: sixtyDaysAgo } },
        select: { submittedAt: true },
      }),
    ]);

    // 合并所有活动日期
    const activeDays = new Set<string>();
    notesDates.forEach((n) => activeDays.add(n.createdAt.toISOString().slice(0, 10)));
    attemptsDates.forEach((a) => activeDays.add(a.submittedAt.toISOString().slice(0, 10)));

    // 从今天往回数连续天数
    let streak = 0;
    const date = new Date();
    while (true) {
      const key = date.toISOString().slice(0, 10);
      if (activeDays.has(key)) {
        streak++;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }
}
