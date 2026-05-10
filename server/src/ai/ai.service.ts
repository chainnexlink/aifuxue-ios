import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string | Array<{ type: string; text?: string; image_url?: { url: string } }>;
}

interface ChatCompletionResponse {
  choices: Array<{
    message: { role: string; content: string };
  }>;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  // 豆包视觉模型（OCR/图像识别）
  private doubaoApiKey: string;
  private doubaoEndpointId: string;
  private readonly doubaoBaseUrl = 'https://ark.cn-beijing.volces.com/api/v3';

  // DeepSeek 文本模型（AI内容生成）- 火山引擎部署
  private deepseekApiKey: string;
  private deepseekEndpointId: string;

  constructor(private configService: ConfigService) {
    this.doubaoApiKey = this.configService.get<string>('DOUBAO_API_KEY') || '';
    this.doubaoEndpointId = this.configService.get<string>('DOUBAO_ENDPOINT_ID') || '';
    this.deepseekApiKey = this.configService.get<string>('DEEPSEEK_API_KEY') || '';
    this.deepseekEndpointId = this.configService.get<string>('DEEPSEEK_ENDPOINT_ID') || '';

    if (!this.doubaoApiKey) this.logger.warn('DOUBAO_API_KEY 未配置，视觉识别不可用');
    if (!this.deepseekApiKey) this.logger.warn('DEEPSEEK_API_KEY 未配置，AI生成不可用');
  }

  /**
   * 读取本地图片文件并转为 base64 data URL
   */
  private imageFileToBase64(filePath: string): string {
    const absolutePath = path.resolve(filePath);
    const buffer = fs.readFileSync(absolutePath);
    const ext = path.extname(filePath).toLowerCase().replace('.', '');
    const mimeType = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
  }

  /**
   * 调用豆包视觉模型识别图片中的文字（OCR）
   * @param imageUrls 图片路径数组（本地路径或网络URL）
   * @returns 识别出的文字内容
   */
  async ocrImages(imageUrls: string[]): Promise<string> {
    if (!this.doubaoApiKey || !this.doubaoEndpointId) {
      this.logger.warn('豆包API未配置，返回模拟OCR结果');
      return '这是OCR识别出的文本内容。包含知识点：函数的定义、导数的基本公式、积分的应用。';
    }

    // 构建图片内容
    const imageContents: Array<{ type: string; image_url?: { url: string }; text?: string }> = [];
    for (const url of imageUrls) {
      let imageUrl: string;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        imageUrl = url;
      } else {
        // 本地文件，转 base64
        try {
          imageUrl = this.imageFileToBase64(url);
        } catch (err) {
          this.logger.error(`读取图片失败: ${url}`, err);
          continue;
        }
      }
      imageContents.push({ type: 'image_url', image_url: { url: imageUrl } });
    }

    if (imageContents.length === 0) {
      throw new Error('没有可用的图片');
    }

    imageContents.push({
      type: 'text',
      text: '请仔细识别图片中的所有文字内容，包括手写和印刷体。按原文顺序完整输出识别结果，保留段落结构。如果有数学公式，用LaTeX格式表示。',
    });

    const messages: ChatMessage[] = [
      {
        role: 'system',
        content: '你是一个专业的OCR文字识别助手。你的任务是准确识别图片中的所有文字内容并完整输出。',
      },
      {
        role: 'user',
        content: imageContents,
      },
    ];

    const result = await this.callDoubao(messages);
    return result;
  }

  /**
   * 调用豆包视觉模型进行图片内容分析
   * @param imageUrls 图片路径数组
   * @param prompt 分析提示词
   * @returns 分析结果
   */
  async analyzeImages(imageUrls: string[], prompt: string): Promise<string> {
    if (!this.doubaoApiKey || !this.doubaoEndpointId) {
      this.logger.warn('豆包API未配置，返回模拟结果');
      return '';
    }

    const imageContents: Array<{ type: string; image_url?: { url: string }; text?: string }> = [];
    for (const url of imageUrls) {
      let imageUrl: string;
      if (url.startsWith('http://') || url.startsWith('https://')) {
        imageUrl = url;
      } else {
        try {
          imageUrl = this.imageFileToBase64(url);
        } catch (err) {
          this.logger.error(`读取图片失败: ${url}`, err);
          continue;
        }
      }
      imageContents.push({ type: 'image_url', image_url: { url: imageUrl } });
    }

    imageContents.push({ type: 'text', text: prompt });

    const messages: ChatMessage[] = [
      { role: 'user', content: imageContents },
    ];

    return this.callDoubao(messages);
  }

  /**
   * 调用豆包 API（OpenAI 兼容格式）
   */
  private async callDoubao(messages: ChatMessage[]): Promise<string> {
    const url = `${this.doubaoBaseUrl}/chat/completions`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒超时

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.doubaoApiKey}`,
        },
        body: JSON.stringify({
          model: this.doubaoEndpointId,
          messages,
          max_tokens: 4096,
          temperature: 0.1,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`豆包API调用失败: ${response.status} ${errorText}`);
        throw new Error(`AI服务调用失败: ${response.status}`);
      }

      const data = (await response.json()) as ChatCompletionResponse;
      return data.choices?.[0]?.message?.content || '';
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * 调用 DeepSeek 文本模型生成内容（火山引擎部署）
   */
  async generateText(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.deepseekApiKey || !this.deepseekEndpointId) {
      this.logger.warn('DeepSeek API未配置，返回空结果');
      return '';
    }

    const url = `${this.doubaoBaseUrl}/chat/completions`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.deepseekApiKey}`,
        },
        body: JSON.stringify({
          model: this.deepseekEndpointId,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          max_tokens: 4096,
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`DeepSeek API调用失败: ${response.status} ${errorText}`);
        throw new Error(`AI服务调用失败: ${response.status}`);
      }

      const data = (await response.json()) as ChatCompletionResponse;
      return data.choices?.[0]?.message?.content || '';
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
