import { Test, TestingModule } from '@nestjs/testing';
import { TagsLiveController } from './tags-live.controller';

describe('TagsLiveController', () => {
  let controller: TagsLiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsLiveController],
    }).compile();

    controller = module.get<TagsLiveController>(TagsLiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
