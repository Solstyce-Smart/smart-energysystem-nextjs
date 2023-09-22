import { Test, TestingModule } from '@nestjs/testing';
import { searchController } from './search.controller';
import { searchService } from './search.service';
import { dataSearchService } from './dataSearch.service';
import { ElasticsearchService } from '@nestjs/elasticsearch';
describe('SearchController', () => {
  let controller: searchController;
  let service: searchService;
  let dataService: dataSearchService;
  let elasticService: ElasticsearchService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [searchService, dataSearchService, ElasticsearchService],
      controllers: [searchController],
    })
      .overrideProvider(ElasticsearchService)
      .useValue({})
      .compile();

    controller = module.get<searchController>(searchController);
    service = module.get<searchService>(searchService);
    dataService = module.get<dataSearchService>(dataSearchService);
    elasticService = module.get<ElasticsearchService>(ElasticsearchService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
