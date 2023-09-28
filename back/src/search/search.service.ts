import { Injectable } from '@nestjs/common';
import { dataSearchService } from './dataSearch.service';
import { PostDatasDto } from './dto/PostDatas.dto';
import { getEwon } from '../ewonApi/getEwon';
import { GetDatasBody } from './types/GetDatasBody.interface';
import { TagsHistory } from './entity/tagHistory.entity';

@Injectable()
export class searchService {
  constructor(private readonly elasticService: dataSearchService) {}

  async postDatas() {
    const datas = await getEwon();
    const newDatas: TagsHistory[] = [];
    for (let i = 0; i < datas.tags.length; i++) {
      const data = {
        ewonId: datas.id,
        name: datas.tags[i].name,
        lastSynchroDate: datas.lastSynchroDate,
        tagName: datas.tags[i].name,
        dateReq: new Date(),
        value: datas.tags[i].value,
        quality: datas.tags[i].quality,
      };
      newDatas.push(data);
    }
    console.log(datas);
    return this.elasticService.create(newDatas);
  }

  async getDatasByEwonId() {
    return this.elasticService.searchByEwonId();
  }
}
