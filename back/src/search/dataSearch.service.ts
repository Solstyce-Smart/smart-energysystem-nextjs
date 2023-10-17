import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { GetDatasResult } from './types/GetDatasResult.interface';
import { TagsHistory } from './entity/tagHistory.entity';
import dotenv from 'dotenv';

dotenv.config();

const index = process.env.ELASTICSEARCH_INDEX;
@Injectable()
export class dataSearchService {
  constructor(private readonly elasticService: ElasticsearchService) {}

  async create(tagsHistoryArray: TagsHistory[]) {
    const body = tagsHistoryArray.flatMap((tagsHistory) => [
      { index: { _index: index } },
      {
        ewonId: tagsHistory.ewonId,
        tagName: tagsHistory.tagName,
        dateReq: tagsHistory.dateReq,
        value: tagsHistory.value,
        quality: tagsHistory.quality,
      },
    ]);

    return this.elasticService.bulk({ body });
  }

  async searchByEwonId(ewonId: string) {
    const body = await this.elasticService.search<GetDatasResult>({
      index,
      query: {
        match: {
          ewonId: ewonId,
        },
      },
      size: 10000,
    });
    return body.hits.hits.map((hit) => hit._source);
  }

  async searchByTagsName(ewonId: string, tagsName: string) {
    const body = await this.elasticService.search<GetDatasResult>({
      index,
      query: {
        bool: {
          must: [
            {
              match: {
                ewonId: ewonId,
              },
            },
            {
              match: {
                tagName: tagsName,
              },
            },
          ],
        },
      },
      size: 10000,
    });
    return body.hits.hits.map((hit) => hit._source);
  }
}
