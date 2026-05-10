import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';

@Injectable()
export class ExercisesService {
  private readonly logger = new Logger(ExercisesService.name);

  constructor(
    private prisma: PrismaService,
    private ai: AiService,
  ) {}

  async generate(userId: string, noteId: string) {
    // 验证笔记归属
    const note = await this.prisma.note.findUnique({ where: { id: noteId } });
    if (!note || note.userId !== userId) {
      throw new NotFoundException('笔记不存在');
    }

    // 检查免费用户每日次数
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
      const count = await this.prisma.adWatchLog.count({
        where: {
          userId,
          adType: 'exercise_generate',
          watchedAt: { gte: todayStart },
        },
      });
      if (count >= 2) {
        throw new ForbiddenException('今日免费生成次数已用完（2次/天）');
      }
      await this.prisma.adWatchLog.create({
        data: { userId, adType: 'exercise_generate' },
      });
    }

    // 调用 DeepSeek 基于笔记内容生成题目
    const noteContent = note.markdownContent || note.originalOcr || '';
    const questions = await this.generateQuestions(noteContent);

    const exercise = await this.prisma.exercise.create({
      data: {
        userId,
        noteId,
        questionsJson: questions as any,
        totalCount: questions.length,
      },
    });

    // 返回题目但不含答案
    const questionsWithoutAnswers = questions.map((q: any) => ({
      type: q.type,
      question: q.question,
      options: q.options,
    }));

    return {
      id: exercise.id,
      questions: questionsWithoutAnswers,
      totalCount: questions.length,
    };
  }

  /**
   * 调用 DeepSeek 生成习题
   */
  private async generateQuestions(noteContent: string): Promise<any[]> {
    const systemPrompt = `你是一个专业的教育出题助手。根据给定的学习笔记内容出题。
你必须严格按照以下 JSON 格式返回，不要包含任何其他文字，只返回 JSON 数组：
[
  {
    "type": "choice",
    "question": "题目内容",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "correctIndex": 0,
    "explanation": "解析说明"
  },
  {
    "type": "judge",
    "question": "判断题内容",
    "correctIndex": 0,
    "explanation": "解析说明"
  },
  {
    "type": "fill",
    "question": "填空题内容，空格用____表示",
    "correctAnswer": "正确答案",
    "correctIndex": -1,
    "explanation": "解析说明"
  }
]

要求：
- 生成5道题，包含3道选择题、1道判断题、1道填空题
- correctIndex 对于选择题是正确选项索引（0-3），判断题0=错误 1=正确
- 题目紧扣笔记内容中的知识点
- 每道题必须有详细的解析（explanation）
- 难度适中，适合中学生`;

    const userPrompt = `请根据以下笔记内容生成练习题：\n\n${noteContent.slice(0, 3000)}`;

    try {
      const result = await this.ai.generateText(systemPrompt, userPrompt);
      const jsonMatch = result.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const questions = JSON.parse(jsonMatch[0]);
        if (Array.isArray(questions) && questions.length > 0) {
          this.logger.log(`AI生成了 ${questions.length} 道题目`);
          return questions;
        }
      }
      this.logger.warn('AI返回格式异常，使用备用题目');
      return this.getFallbackQuestions();
    } catch (err) {
      this.logger.error('AI生成题目失败:', err);
      return this.getFallbackQuestions();
    }
  }

  private getFallbackQuestions(): any[] {
    throw new Error('AI出题服务暂时不可用，请稍后重试');
  }

  async getById(userId: string, exerciseId: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });
    if (!exercise || exercise.userId !== userId) {
      throw new NotFoundException('练习不存在');
    }

    const questions = (exercise.questionsJson as any[]).map((q) => ({
      type: q.type,
      question: q.question,
      options: q.options,
    }));

    return { id: exercise.id, questions, totalCount: exercise.totalCount };
  }

  async getAnswerKey(userId: string, exerciseId: string) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });
    if (!exercise || exercise.userId !== userId) {
      throw new NotFoundException('练习不存在');
    }
    return {
      id: exercise.id,
      answers: exercise.questionsJson,
    };
  }

  async submit(userId: string, exerciseId: string, answersJson: any) {
    const exercise = await this.prisma.exercise.findUnique({
      where: { id: exerciseId },
    });
    if (!exercise || exercise.userId !== userId) {
      throw new NotFoundException('练习不存在');
    }

    const questions = exercise.questionsJson as any[];
    let correct = 0;
    questions.forEach((q, i) => {
      const userAnswer = answersJson[i];
      if (q.type === 'fill') {
        if (userAnswer?.trim() === q.correctAnswer) correct++;
      } else {
        if (userAnswer === q.correctIndex) correct++;
      }
    });

    const score = correct * 10;
    const attempt = await this.prisma.exerciseAttempt.create({
      data: {
        exerciseId,
        userId,
        answersJson,
        score,
        totalScore: questions.length * 10,
      },
    });

    return { id: attempt.id, score, totalScore: questions.length * 10, correct };
  }
}
