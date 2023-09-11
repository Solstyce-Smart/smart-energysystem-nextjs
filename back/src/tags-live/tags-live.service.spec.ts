import { Test, TestingModule } from '@nestjs/testing';
import { TagsLiveService } from './tags-live.service';

describe('TagsLiveService', () => {
  let service: TagsLiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TagsLiveService],
    }).compile();

    service = module.get<TagsLiveService>(TagsLiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
