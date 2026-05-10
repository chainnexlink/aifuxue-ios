import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GradesService } from './grades.service';
import * as path from 'path';
import * as fs from 'fs';

@Controller('grades')
export class GradesController {
  private readonly logger = new Logger(GradesController.name);

  constructor(private readonly gradesService: GradesService) {}

  @Post('import-excel')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = path.resolve(process.cwd(), 'uploads');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const ext = path.extname(file.originalname);
          cb(null, `grade-import-${Date.now()}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext === '.xlsx' || ext === '.xls') {
          cb(null, true);
        } else {
          cb(new Error('只支持 .xlsx 或 .xls 文件'), false);
        }
      },
    }),
  )
  async importExcel(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { code: 400, message: '请上传Excel文件' };
    }

    try {
      const data = this.gradesService.parseExcelFile(file.path);

      // 清理临时文件
      try { fs.unlinkSync(file.path); } catch {}

      return {
        code: 0,
        message: '解析成功',
        data,
      };
    } catch (error: any) {
      // 清理临时文件
      try { fs.unlinkSync(file.path); } catch {}

      this.logger.error(`导入Excel失败: ${error.message}`);
      return { code: 500, message: error.message || 'Excel解析失败' };
    }
  }
}
