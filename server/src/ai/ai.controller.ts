import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AiService } from './ai.service';

interface TeachingPlanDto {
  stage: string;      // 学段: 小学/初中/高中
  subject: string;    // 学科: 语文/数学/英语/物理/化学/生物等
  grade: string;      // 年级: 一年级~高三
  textbookVersion: string; // 教材版本: 部编人教版/北师大版/苏教版/粤教版等
  lessonName: string; // 课文全称
  period: string;     // 课时: 第1课时/第2课时 (可留空)
}

@Controller('ai')
export class AiController {
  private readonly logger = new Logger(AiController.name);

  constructor(private readonly aiService: AiService) {}

  @Post('teaching-plan')
  async generateTeachingPlan(@Body() dto: TeachingPlanDto) {
    const { stage, subject, grade, textbookVersion, lessonName, period } = dto;

    if (!stage || !subject || !grade || !textbookVersion || !lessonName) {
      return { code: 400, message: '请填写完整的参数（学段/学科/年级/教材版本/课文全称）' };
    }

    const periodText = period ? `，${period}` : '';

    const systemPrompt = `你现在扮演资深公立学校一线教研老师，严格按照给定条件生成标准教学资料。
限定条件：${stage}、${subject}、${grade}、${textbookVersion}、《${lessonName}》${periodText}。

要求如下：

1. 严格匹配对应教材官方完整课本原文，一字不改、不删减、不改写，保证内容绝对准确，不需要标注任何页码；

2. 按照国内中小学官方统一教案格式，生成完整标准教案，包含：教学目标、教学重难点、课前准备、完整教学流程、板书设计、课后作业布置；

3. 同步生成适配教室多媒体大屏16:9标准比例的授课PPT内容框架，自动适配大屏投屏排版，固定合适字号、分段清晰、无错乱排版，可直接投屏上课；

4. 语言贴合公立学校正规教学风格，结构规整、逻辑清晰，无多余花哨内容，生成的教案可直接用于课堂授课，也可直接上交学校存档检查；

5. 不允许虚构课文内容、不篡改教材知识点，严格依据公开正规教学资源整理生成。`;

    const userPrompt = `请为${stage}${grade}${subject}课程生成《${lessonName}》${periodText}的完整教案和PPT框架。
教材版本：${textbookVersion}

请按以下结构输出：

一、课本原文
（完整课文原文，一字不改）

二、教案
  1. 教学目标
  2. 教学重难点
  3. 课前准备
  4. 完整教学流程（含各环节时间分配）
  5. 板书设计
  6. 课后作业布置

三、PPT内容框架（16:9大屏适配）
  第1页
  - 标题：[课文标题]
  - 副标题：[年级学科 + 教材版本 + 课时信息]
  
  第2页
  - 标题：教学目标
  
  （后续每页详细内容）

请确保内容准确、格式规整，可直接用于实际教学。`;

    this.logger.log(`开始生成教案: ${stage}${grade}${subject} - ${lessonName}${periodText}`);

    try {
      const result = await this.aiService.generateText(systemPrompt, userPrompt);

      if (!result) {
        return { code: 500, message: 'AI服务暂不可用，请稍后重试' };
      }

      return {
        code: 0,
        data: {
          content: result,
          meta: { stage, subject, grade, textbookVersion, lessonName, period },
        },
      };
    } catch (error: any) {
      this.logger.error(`教案生成失败: ${error.message}`);
      return { code: 500, message: `生成失败: ${error.message}` };
    }
  }
}
