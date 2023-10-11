import { Injectable } from '@nestjs/common';
import { dataSearchService } from './dataSearch.service';
import { PostDatasDto } from './dto/PostDatas.dto';

@Injectable()
export class searchService {
  constructor(private readonly elasticService: dataSearchService) {}

  async postDatas(data: PostDatasDto[]) {
    return this.elasticService.create(data);
  }

  async getDatasByEwonId(ewonId: string) {
    return this.elasticService.searchByEwonId(ewonId);
  }
}
