import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { NotesService } from './notes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('images', 9, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per file
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.match(/^image\//)) {
          cb(new Error('只支持图片文件'), false);
          return;
        }
        cb(null, true);
      },
    }),
  )
  async upload(
    @CurrentUser('sub') userId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body('title') title?: string,
    @Body('subject') subject?: string,
  ) {
    if (!files || files.length === 0) {
      return { message: '请上传至少一张图片' };
    }

    const imageUrls = files.map((f) => `/uploads/${f.filename}`);
    return this.notesService.createNote(userId, imageUrls, title, subject);
  }

  @Get()
  async list(
    @CurrentUser('sub') userId: string,
    @Query('page') page?: string,
    @Query('pageSize') pageSize?: string,
    @Query('subject') subject?: string,
  ) {
    return this.notesService.listNotes(
      userId,
      page ? parseInt(page, 10) : 1,
      pageSize ? parseInt(pageSize, 10) : 20,
      subject,
    );
  }

  @Get(':id')
  async getNote(
    @CurrentUser('sub') userId: string,
    @Param('id') noteId: string,
  ) {
    return this.notesService.getNoteById(userId, noteId);
  }

  @Post(':id/unlock')
  async unlock(
    @CurrentUser('sub') userId: string,
    @Param('id') noteId: string,
  ) {
    return this.notesService.unlockNote(userId, noteId);
  }

  @Delete(':id')
  async delete(
    @CurrentUser('sub') userId: string,
    @Param('id') noteId: string,
  ) {
    return this.notesService.deleteNote(userId, noteId);
  }
}
