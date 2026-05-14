import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { SearchService } from './search.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async search(
    @CurrentUser('sub') userId: string,
    @Query('keyword') keyword: string,
    @Query('role') role: string,
  ) {
    if (!keyword || keyword.trim().length === 0) {
      return { results: [] };
    }
    return this.searchService.search(userId, keyword.trim(), role || 'student');
  }
}
