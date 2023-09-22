import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { GetDatasResult } from './types/GetDatasResult.interface';
import { TagsHistory } from './entity/tagHistory.entity';
import dotenv from 'dotenv';

dotenv.config();

const index = process.env.ELASTICSEARCH_INDEX;
const ewonId = process.env.ELASTICSEARCH_EWONID;
@Injectable()
export class dataSearchService {
  constructor(private readonly elasticService: ElasticsearchService) {}

  async create(tagsHistory: TagsHistory) {
    return this.elasticService.index({
      index,
      body: {
        ewonId: tagsHistory.ewonId,
        tagName: tagsHistory.tagName,
        dateReq: tagsHistory.dateReq,
        value: tagsHistory.value,
        quality: tagsHistory.quality,
      },
    });
  }

  async searchByEwonId() {
    console.log(index, ewonId);

    const body = await this.elasticService.search<GetDatasResult>({
      index,
      query: {
        match: {
          ewonId: ewonId,
        },
      },
    });
    return body.hits.hits.map((hit) => hit._source);
  }
}
