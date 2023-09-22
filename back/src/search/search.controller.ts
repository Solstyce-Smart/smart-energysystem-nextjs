import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { searchService } from './search.service';
import { PostDatasDto } from './dto/PostDatas.dto';
import dotenv from 'dotenv';

dotenv.config();

const index = process.env.ELASTICSEARCH_INDEX;

@Controller('elastic')
export class searchController {
  constructor(private readonly searchService: searchService) {}

  @Get(index)
  async getDatasByEwonId() {
    const result = await this.searchService.getDatasByEwonId();
    return result;
  }

  @Post(index)
  async postDatas(@Body() data: PostDatasDto) {
    const result = await this.searchService.postDatas(data);
    return result;
  }
}
