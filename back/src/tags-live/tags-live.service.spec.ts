import { Test, TestingModule } from '@nestjs/testing';
import { TagsLiveService } from './tags-live.service';
import { TagsLiveController } from './tags-live.controller';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../entity/Users';
import { Installation } from '../entity/Installations';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';
import { TagsLive } from '../entity/TagsLive';

describe('TagsLiveService', () => {
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
        { provide: getEntityManagerToken(), useClass: EntityManager },
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
  });

  const installationMock: Installation = {
    id: 26,
    ewonId: 'hakunamatutu',
    name: 'centrale',
    nbIRVE: 4,
    battery: true,
    abo: 2,
    lastSynchroDate: '255d15d1f5fd8d',
    address: [
      {
        address: '3 rue des machins',
        latitude: 'fdsfsfdsfsf',
        longitude: 'fdsfsdfsdfsdf',
        postalCode: 215882,
      },
    ],
    tagsLive: null,
    user: null,
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTagsLive', () => {
    it('should return null if user is not found', async () => {
      const userId = null;
      const installationId = 1;

      // Mocking EntityManager to return null for findOne
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(null);

      const result = await service.getTagsLive(userId, installationId);

      expect(result).toBeNull();
    });

    it('should return null if installation is not found', async () => {
      const userId = 1;
      const installationId = 99999;

      // Mocking EntityManager to return user but not installation
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(null);

      const result = await service.getTagsLive(userId, installationId);

      expect(result).toBeNull();
    });

    it('should return tagsLive if installation is found', async () => {
      const userId = 5;
      const installationId = 13;

      const tagsLiveMock: TagsLive = {
        id: 1,
        lastSynchroDate: '255d15d1f5fd8d',
        dateReq: '255d15d1f5fd8d',
        value: 1,
        quality: 'fdsfsdfsdfsdf',
        alarmHint: 'fdsfsdfsdfsdf',
        ewonTagId: 1,
        installation: null,
      };

      const entityManagerFindOneSpy = jest.spyOn(entityManager, 'findOne');
      entityManagerFindOneSpy.mockResolvedValue({
        id: installationId,
        tagsLive: tagsLiveMock,
      });

      const result = await service.getTagsLive(userId, installationId);

      expect(result).toEqual(tagsLiveMock);
    });
  });
});
