import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('website')
export class WebsiteController {
  constructor(private websiteService: WebsiteService) {}

  // ============ 前台公开接口 ============

  // 获取某个 section 的内容（前台使用）
  @Get('content/:section')
  async getSection(@Param('section') section: string) {
    return this.websiteService.getSection(section);
  }

  // 获取某个具体内容项
  @Get('content/:section/:key')
  async getItem(@Param('section') section: string, @Param('key') key: string) {
    return this.websiteService.getItem(section, key);
  }

  // ============ 管理后台接口（需认证）============
  @UseGuards(JwtAuthGuard)

  // 获取所有 section（后台管理用）
  @Get('admin/all')
  async getAll() {
    return this.websiteService.getAllSections();
  }

  // 创建或更新内容
  @Post('admin/upsert')
  async upsert(@Body() body: { section: string; key: string; title?: string; content: any; sortOrder?: number; isActive?: boolean }) {
    return this.websiteService.upsertItem(body);
  }

  // 批量更新 section
  @Post('admin/batch/:section')
  async batchUpsert(
    @Param('section') section: string,
    @Body() body: { items: { key: string; title?: string; content: any; sortOrder?: number; isActive?: boolean }[] },
  ) {
    return this.websiteService.batchUpsertSection(section, body.items);
  }

  // 删除内容
  @Delete('admin/:id')
  async delete(@Param('id') id: string) {
    return this.websiteService.deleteItem(id);
  }

  // 切换启用状态
  @Put('admin/:id/toggle')
  async toggle(@Param('id') id: string) {
    return this.websiteService.toggleActive(id);
  }

  // 初始化默认内容
  @Post('admin/init')
  async initDefault() {
    return this.websiteService.initDefaultContent();
  }
}
