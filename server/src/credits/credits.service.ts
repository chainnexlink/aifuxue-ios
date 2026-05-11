import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreditTransactionType } from '@prisma/client';

@Injectable()
export class CreditsService {
  constructor(private prisma: PrismaService) {}

  /** 获取教师积分余额 */
  async getBalance(teacherId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: teacherId },
      select: { credits: true, role: true },
    });
    if (!user || user.role !== 'teacher') {
      throw new BadRequestException('仅教师账户可使用积分功能');
    }
    return { credits: user.credits };
  }

  /** 获取积分明细 */
  async getHistory(teacherId: string, query: { type?: string; page?: number; pageSize?: number }) {
    const page = query.page || 1;
    const pageSize = query.pageSize || 20;

    const where: any = { teacherId };
    if (query.type) {
      where.type = query.type as CreditTransactionType;
    }

    const [total, records] = await Promise.all([
      this.prisma.creditTransaction.count({ where }),
      this.prisma.creditTransaction.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return { total, page, pageSize, records };
  }

  /** 获取积分统计概览 */
  async getOverview(teacherId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: teacherId },
      select: { credits: true, role: true },
    });
    if (!user || user.role !== 'teacher') {
      throw new BadRequestException('仅教师账户可使用积分功能');
    }

    // 累计获得
    const earned = await this.prisma.creditTransaction.aggregate({
      where: { teacherId, amount: { gt: 0 } },
      _sum: { amount: true },
    });

    // 累计消费
    const spent = await this.prisma.creditTransaction.aggregate({
      where: { teacherId, amount: { lt: 0 } },
      _sum: { amount: true },
    });

    // 推荐注册人数
    const referralCount = await this.prisma.user.count({
      where: { referredByTeacherId: teacherId },
    });

    return {
      balance: user.credits,
      totalEarned: earned._sum.amount || 0,
      totalSpent: Math.abs(spent._sum.amount || 0),
      referralCount,
    };
  }

  /** 注册奖励积分（由注册逻辑调用） */
  async awardReferralCredit(teacherId: string, studentId: string) {
    await this.prisma.$transaction(async (tx) => {
      // 增加积分
      await tx.user.update({
        where: { id: teacherId },
        data: { credits: { increment: 1 } },
      });

      // 记录交易
      await tx.creditTransaction.create({
        data: {
          teacherId,
          amount: 1,
          type: CreditTransactionType.REFERRAL,
          description: '学生注册奖励',
          relatedUserId: studentId,
        },
      });
    });
  }

  /** 积分抵扣会员购买（最多50%） */
  async useCreditsForMembership(teacherId: string, creditsToUse: number, planId: string) {
    // 获取方案价格
    const planPrices: Record<string, number> = {
      monthly: 30,
      yearly: 128,
      'per-use': 1,
    };
    const price = planPrices[planId];
    if (!price) {
      throw new BadRequestException('无效的会员方案');
    }

    // 最多抵扣50%
    const maxDeduction = Math.floor(price * 0.5);
    if (creditsToUse > maxDeduction) {
      throw new BadRequestException(`积分最多可抵扣${maxDeduction}元（方案价格的50%）`);
    }

    const user = await this.prisma.user.findUnique({
      where: { id: teacherId },
      select: { credits: true, role: true },
    });
    if (!user || user.role !== 'teacher') {
      throw new BadRequestException('仅教师账户可使用积分功能');
    }
    if (user.credits < creditsToUse) {
      throw new BadRequestException('积分余额不足');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: teacherId },
        data: { credits: { decrement: creditsToUse } },
      });

      await tx.creditTransaction.create({
        data: {
          teacherId,
          amount: -creditsToUse,
          type: CreditTransactionType.MEMBERSHIP_DEDUCTION,
          description: `抵扣会员购买(${planId})，减免${creditsToUse}元`,
        },
      });
    });

    return {
      deducted: creditsToUse,
      actualPrice: price - creditsToUse,
      remainingCredits: user.credits - creditsToUse,
    };
  }

  /** 积分抵扣消耗次数（1积分=1元，无限制） */
  async useCreditsForQuota(teacherId: string, creditsToUse: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: teacherId },
      select: { credits: true, role: true },
    });
    if (!user || user.role !== 'teacher') {
      throw new BadRequestException('仅教师账户可使用积分功能');
    }
    if (user.credits < creditsToUse) {
      throw new BadRequestException('积分余额不足');
    }

    // 1积分=1元，转换为使用次数（1元=2次）
    const quotaGained = creditsToUse * 2;

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: teacherId },
        data: { credits: { decrement: creditsToUse } },
      });

      await tx.creditTransaction.create({
        data: {
          teacherId,
          amount: -creditsToUse,
          type: CreditTransactionType.QUOTA_DEDUCTION,
          description: `积分兑换${quotaGained}次使用额度`,
        },
      });
    });

    return {
      creditsUsed: creditsToUse,
      quotaGained,
      remainingCredits: user.credits - creditsToUse,
    };
  }
}
