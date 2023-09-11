import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Delete,
  Param,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { TagsLiveService } from './tags-live.service';
import { CreateTagLiveDto } from './dto/CreateTagLive.dto';
@Controller(':userId/installations/:id/tags-live')
export class TagsLiveController {
  constructor(private tagsLiveService: TagsLiveService) {}

  @Get()
  getTagsLive(
    @Param('userId') userId: number,
    @Param('id') installationId: number,
  ) {
    return this.tagsLiveService.getTagsLive(userId, installationId);
  }

  @Post()
  createTagLive(
    @Param('userId') userId: number,
    @Param('id') installationId: number,
    @Body() createTagLiveDto: CreateTagLiveDto,
  ) {
    return this.tagsLiveService.createTagLive(
      userId,
      installationId,
      createTagLiveDto,
    );
  }
}
