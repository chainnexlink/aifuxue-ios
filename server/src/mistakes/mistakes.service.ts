import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class MistakesService {
  private readonly logger = new Logger(MistakesService.name);

  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  /**
   * 创建错题（上传图片 → 异步 AI 诊断）
   */
  async create(
    userId: string,
    imageUrls: string[],
    wrongAnswer?: string,
    subject?: string,
  ) {
    const mistake = await this.prisma.mistake.create({
      data: {
        userId,
        imageUrls,
        wrongAnswer,
        subject,
        status: 'processing',
      },
    });

    // 异步处理：OCR + AI 诊断
    this.processMistakeAsync(mistake.id).catch((err) =>
      this.logger.error(`错题处理失败 ${mistake.id}:`, err),
    );

    return {
      id: mistake.id,
      status: 'processing',
      message: '错题正在分析中...',
    };
  }

  /**
   * 异步处理：OCR识别 + AI诊断错因 + 提取知识点
   */
  private async processMistakeAsync(mistakeId: string) {
    try {
      const mistake = await this.prisma.mistake.findUnique({
        where: { id: mistakeId },
      });
      if (!mistake) return;

      // 第一步：OCR 识别题目文字
      this.logger.log(`[${mistakeId}] 开始OCR识别错题...`);
      const ocrText = await this.ai.ocrImages(mistake.imageUrls);
      this.logger.log(`[${mistakeId}] OCR完成，识别 ${ocrText.length} 字`);

      // 第二步：AI 诊断错因 + 提取知识点
      this.logger.log(`[${mistakeId}] 开始AI诊断...`);
      const diagnosisPrompt = [
        '请分析以下错题，返回严格的 JSON 格式（不要包含其他文字）：',
        '{',
        '  "knowledgePoint": "涉及的核心知识点名称",',
        '  "errorReason": "详细分析学生做错的可能原因（100-200字）",',
        '  "avoidTip": "如何避免同类错误的建议（50-100字）",',
        '  "errorType": "错误类型，从以下选择：计算错误/概念不清/审题偏差/方法不当"',
        '}',
        '',
        `题目内容：${ocrText}`,
        mistake.wrongAnswer ? `学生的错误答案：${mistake.wrongAnswer}` : '',
      ].join('\n');

      const diagnosisResult = await this.ai.generateText(
        '你是一个专业的教育诊断助手，擅长分析学生错题的原因。必须返回严格的 JSON 格式。',
        diagnosisPrompt,
      );

      let knowledgePoint = '';
      let errorReason = '';
      try {
        const jsonMatch = diagnosisResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const diagnosis = JSON.parse(jsonMatch[0]);
          knowledgePoint = diagnosis.knowledgePoint || '';
          errorReason = JSON.stringify(diagnosis);
        }
      } catch {
        errorReason = diagnosisResult;
      }

      await this.prisma.mistake.update({
        where: { id: mistakeId },
        data: {
          ocrText,
          knowledgePoint,
          errorReason,
          status: 'completed',
        },
      });
      this.logger.log(`[${mistakeId}] 错题分析完成`);
    } catch (err) {
      this.logger.error(`[${mistakeId}] 处理失败:`, err);
      await this.prisma.mistake
        .update({
          where: { id: mistakeId },
          data: { status: 'failed' },
        })
        .catch(() => {});
    }
  }

  /**
   * 获取错题详情
   */
  async getById(userId: string, mistakeId: string) {
    const mistake = await this.prisma.mistake.findUnique({
      where: { id: mistakeId },
      include: { similarQuestions: true },
    });
    if (!mistake || mistake.userId !== userId) {
      throw new NotFoundException('错题不存在');
    }

    // 解析 errorReason JSON
    let diagnosis: any = {};
    try {
      if (mistake.errorReason) {
        diagnosis = JSON.parse(mistake.errorReason);
      }
    } catch {
      diagnosis = { errorReason: mistake.errorReason };
    }

    return {
      ...mistake,
      diagnosis,
    };
  }

  /**
   * 错题列表
   */
  async list(userId: string, page = 1, pageSize = 20, subject?: string) {
    const where: any = { userId };
    if (subject) where.subject = subject;

    const [list, total] = await Promise.all([
      this.prisma.mistake.findMany({
        where,
        select: {
          id: true,
          imageUrls: true,
          ocrText: true,
          knowledgePoint: true,
          subject: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      this.prisma.mistake.count({ where }),
    ]);

    return { list, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  /**
   * 生成相似题（变式题）
   */
  async generateSimilar(userId: string, mistakeId: string) {
    const mistake = await this.prisma.mistake.findUnique({
      where: { id: mistakeId },
    });
    if (!mistake || mistake.userId !== userId) {
      throw new NotFoundException('错题不存在');
    }
    if (!mistake.ocrText) {
      throw new ForbiddenException('错题尚未分析完成');
    }

    const systemPrompt = `你是一个专业的出题老师。根据给定的错题，生成3道类似的变式题用于巩固练习。
你必须严格返回 JSON 数组格式，不要包含其他文字：
[
  {
    "type": "choice",
    "question": "题目内容",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "correctIndex": 0,
    "explanation": "解析"
  }
]
要求：
- 生成3道选择题
- 题目与原题考查相同知识点，但数字/情境不同
- 难度相当或略高
- 每题有详细解析`;

    const userPrompt = `原题内容：${mistake.ocrText.slice(0, 2000)}\n知识点：${mistake.knowledgePoint || '未知'}`;

    try {
      const result = await this.ai.generateText(systemPrompt, userPrompt);
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      let questions: any[] = [];
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      }

      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('AI返回格式异常');
      }

      const similar = await this.prisma.similarQuestion.create({
        data: {
          mistakeId,
          questionsJson: questions as any,
        },
      });

      // 返回不含答案的题目
      const questionsNoAnswer = questions.map((q: any) => ({
        type: q.type,
        question: q.question,
        options: q.options,
      }));

      return {
        id: similar.id,
        questions: questionsNoAnswer,
        totalCount: questions.length,
      };
    } catch (err) {
      this.logger.error('生成相似题失败:', err);
      throw new ForbiddenException('生成相似题失败，请稍后重试');
    }
  }

  /**
   * 提交相似题答案
   */
  async submitSimilar(userId: string, similarId: string, answersJson: any) {
    const similar = await this.prisma.similarQuestion.findUnique({
      where: { id: similarId },
      include: { mistake: { select: { userId: true } } },
    });
    if (!similar || similar.mistake.userId !== userId) {
      throw new NotFoundException('练习不存在');
    }

    const questions = similar.questionsJson as any[];
    let correct = 0;
    questions.forEach((q, i) => {
      if (answersJson[i] === q.correctIndex) correct++;
    });

    const attempt = await this.prisma.similarAttempt.create({
      data: {
        similarQuestionId: similarId,
        userId,
        answersJson,
        score: correct * 10,
      },
    });

    return {
      id: attempt.id,
      score: correct * 10,
      totalScore: questions.length * 10,
      correct,
      answers: questions,
    };
  }

  /**
   * 删除错题
   */
  async delete(userId: string, mistakeId: string) {
    const mistake = await this.prisma.mistake.findUnique({
      where: { id: mistakeId },
    });
    if (!mistake || mistake.userId !== userId) {
      throw new NotFoundException('错题不存在');
    }
    await this.prisma.mistake.delete({ where: { id: mistakeId } });
    return { message: '错题已删除' };
  }
}
