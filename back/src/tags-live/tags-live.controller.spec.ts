import { Test, TestingModule } from '@nestjs/testing';
import { TagsLiveController } from './tags-live.controller';
import { TagsLiveService } from './tags-live.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TagsLive } from '../entity/TagsLive.entity';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../entity/Users.entity';
import { Installation } from '../entity/Installations.entity';

describe('TagsLiveController', () => {
  let service: TagsLiveService;
  let controller: TagsLiveController;
  let entityManager: EntityManager;
  let userRepository: Repository<User>;
  let installationRepository: Repository<Installation>;
  let tagsLiveRepository: Repository<TagsLive>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsLiveService,
        { provide: getRepositoryToken(TagsLive), useClass: Repository },
        { provide: getRepositoryToken(User), useClass: Repository },
        { provide: getRepositoryToken(Installation), useClass: Repository },
        { provide: EntityManager, useClass: EntityManager },
      ],
      controllers: [TagsLiveController],
    }).compile();

    service = module.get<TagsLiveService>(TagsLiveService);
    tagsLiveRepository = module.get<Repository<TagsLive>>(
      getRepositoryToken(TagsLive),
    );
    controller = module.get<TagsLiveController>(TagsLiveController);
    entityManager = module.get<EntityManager>(EntityManager);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    installationRepository = module.get<Repository<Installation>>(
      getRepositoryToken(Installation),
    );

    controller = module.get<TagsLiveController>(TagsLiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
