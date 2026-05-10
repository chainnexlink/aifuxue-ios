import { Injectable, Logger } from '@nestjs/common';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class GradesService {
  private readonly logger = new Logger(GradesService.name);

  /**
   * 解析上传的Excel成绩文件
   * 支持 .xlsx / .xls
   * 要求第一列为姓名，第二列为分数
   */
  parseExcelFile(filePath: string): Array<{ name: string; score: string }> {
    const ext = path.extname(filePath).toLowerCase();

    if (ext !== '.xlsx' && ext !== '.xls') {
      throw new Error('不支持的文件格式，请上传 .xlsx 或 .xls 文件');
    }

    try {
      const buffer = fs.readFileSync(filePath);
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        throw new Error('Excel文件中没有找到工作表');
      }

      const sheet = workbook.Sheets[sheetName];
      const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      if (!data || data.length < 2) {
        throw new Error('Excel文件内容为空或只有表头');
      }

      const results: Array<{ name: string; score: string }> = [];

      // 跳过第一行（表头），从第二行开始解析
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || !row[0]) continue; // 跳过空行

        const name = String(row[0]).trim();
        const score = row[1] !== undefined && row[1] !== null ? String(row[1]).trim() : '';

        if (name) {
          results.push({ name, score });
        }
      }

      this.logger.log(`解析完成: ${results.length} 条学生成绩记录`);
      return results;
    } catch (error: any) {
      this.logger.error(`Excel解析失败: ${error.message}`);
      throw new Error(`Excel解析失败: ${error.message}`);
    }
  }
}
