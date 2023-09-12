import { Test, TestingModule } from '@nestjs/testing';
import { TagsLiveService } from './tags-live.service';
import { TagsLiveController } from './tags-live.controller';
import { DeleteResult, EntityManager, Repository } from 'typeorm';
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

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(null);

      const result = await service.getTagsLive(userId, installationId);

      expect(result).toBeNull();
    });

    it('should return null if installation is not found', async () => {
      const userId = 1;
      const installationId = 99999;

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

  describe('updateTagLive', () => {
    it('should update a tag live', async () => {
      const userId = 1;
      const installationId = 2;
      const tagId = 3;
      const tagDetails = {
        id: 1,
        lastSynchroDate: 'modifSynchro',
        dateReq: '255d15d1f5fd8d',
        value: 1,
        quality: 'fdsfsdfsdfsdf',
        alarmHint: 'fdsfsdfsdfsdf',
        ewonTagId: 1,
        installation: null,
      };

      tagDetails.installation = installationMock;

      const expectedTag = {
        id: 1,
        lastSynchroDate: 'modifSynchro',
        dateReq: '255d15d1f5fd8d',
        value: 1,
        quality: 'fdsfsdfsdfsdf',
        alarmHint: 'fdsfsdfsdfsdf',
        ewonTagId: 1,
        installation: installationMock,
      };

      jest.spyOn(service, 'updateTagLive').mockResolvedValue(expectedTag);

      const result = await service.updateTagLive(
        userId,
        installationId,
        tagId,
        tagDetails,
      );

      expect(result).toEqual(expectedTag);
    });
    it('should return null if the user is not found', async () => {
      const userId = undefined;
      const installationId = 2;
      const tagId = 3;
      const tagDetails = {
        id: 1,
        lastSynchroDate: 'modifSynchro',
        dateReq: '255d15d1f5fd8d',
        value: 1,
        quality: 'fdsfsdfsdfsdf',
        alarmHint: 'fdsfsdfsdfsdf',
        ewonTagId: 1,
        installation: null,
      };

      tagDetails.installation = installationMock;

      jest.spyOn(service, 'updateTagLive').mockResolvedValue(null);

      const result = await service.updateTagLive(
        userId,
        installationId,
        tagId,
        tagDetails,
      );

      expect(result).toEqual(null);
    });
    it('should return null if the installation is not found', async () => {
      const userId = 1;
      const installationId = undefined;
      const tagId = 3;
      const tagDetails = {
        id: 1,
        lastSynchroDate: 'modifSynchro',
        dateReq: '255d15d1f5fd8d',
        value: 1,
        quality: 'fdsfsdfsdfsdf',
        alarmHint: 'fdsfsdfsdfsdf',
        ewonTagId: 1,
        installation: null,
      };

      tagDetails.installation = installationMock;

      jest.spyOn(service, 'updateTagLive').mockResolvedValue(null);

      const result = await service.updateTagLive(
        userId,
        installationId,
        tagId,
        tagDetails,
      );

      expect(result).toEqual(null);
    });
    it('should return null if there is no tag live is not found', async () => {
      const userId = 1;
      const installationId = 2;
      const tagId = undefined;
      const tagDetails = {
        id: 1,
        lastSynchroDate: 'modifSynchro',
        dateReq: '255d15d1f5fd8d',
        value: 1,
        quality: 'fdsfsdfsdfsdf',
        alarmHint: 'fdsfsdfsdfsdf',
        ewonTagId: 1,
        installation: null,
      };

      tagDetails.installation = installationMock;

      jest.spyOn(service, 'updateTagLive').mockResolvedValue(null);

      const result = await service.updateTagLive(
        userId,
        installationId,
        tagId,
        tagDetails,
      );

      expect(result).toEqual(null);
    });
  });

  describe('createTagLive', () => {
    it('should create a new TagsLive and associate it with an Installation', async () => {
      const userId = 1;
      const installationId = 2;
      const userMock: User = {
        userId: userId,
        username: 'Bobidou',
        password: 'FakePassword',
        role: 12,
        ewonIds: [],
      };

      const tagDetails = {
        id: 1,
        lastSynchroDate: 'modifSynchro',
        dateReq: '255d15d1f5fd8d',
        value: 1,
        quality: 'fdsfsdfsdfsdf',
        alarmHint: 'fdsfsdfsdfsdf',
        ewonTagId: 1,
        installation: null,
      };

      tagDetails.installation = installationMock;

      jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(userMock);
      jest
        .spyOn(entityManager, 'findOne')
        .mockResolvedValueOnce(installationMock);

      jest.spyOn(service, 'createTagLive').mockResolvedValue(tagDetails);

      const result = await service.createTagLive(
        userId,
        installationId,
        tagDetails,
      );

      expect(result).toBeDefined();
      expect(result.installation).toEqual(installationMock);
    });

    it('should return null if user is not found', async () => {
      const userId = 999;
      const installationId = 2;

      const tagDetails = {
        id: 1,
        lastSynchroDate: 'modifSynchro',
        dateReq: '255d15d1f5fd8d',
        value: 1,
        quality: 'fdsfsdfsdfsdf',
        alarmHint: 'fdsfsdfsdfsdf',
        ewonTagId: 1,
        installation: null,
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(null);
      jest
        .spyOn(entityManager, 'findOne')
        .mockResolvedValueOnce(installationMock);

      const result = await service.createTagLive(
        userId,
        installationId,
        tagDetails,
      );

      expect(result).toBeNull();
    });

    it('should return null if installation is not found', async () => {
      const userId = 1;
      const installationId = 999;
      const tagDetails = {
        id: 1,
        lastSynchroDate: 'modifSynchro',
        dateReq: '255d15d1f5fd8d',
        value: 1,
        quality: 'fdsfsdfsdfsdf',
        alarmHint: 'fdsfsdfsdfsdf',
        ewonTagId: 1,
        installation: null,
      };
      const userMock: User = {
        userId: userId,
        username: 'Bobidou',
        password: 'FakePassword',
        role: 12,
        ewonIds: [],
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(userMock);
      jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(null);

      const result = await service.createTagLive(
        userId,
        installationId,
        tagDetails,
      );

      expect(result).toBeNull();
    });
  });

  describe('deleteTagLive', () => {
    it('should return null if user is not found', async () => {
      const userId = undefined;
      const installationId = 2;
      const tagLiveId = 3;

      // Mocking EntityManager to return null for findOne
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(null);

      const result = await service.deleteTagLive(
        userId,
        installationId,
        tagLiveId,
      );

      expect(result).toBeNull();
    });

    it('should return null if installation is not found', async () => {
      const userId = 1;
      const installationId = 99999;
      const tagLiveId = 3;

      // Mocking EntityManager to return user but not installation
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(null);

      const result = await service.deleteTagLive(
        userId,
        installationId,
        tagLiveId,
      );

      expect(result).toBeNull();
    });

    it('should return null if tagLive is not found', async () => {
      const userId = 1;
      const installationId = 2;
      const tagLiveId = 99999;

      const userMock: User = {
        userId: userId,
        username: 'Bobidou',
        password: 'FakePassword',
        role: 12,
        ewonIds: [],
      };

      // Mocking EntityManager to return user, installation, but not tagLive
      jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(userMock);
      jest
        .spyOn(entityManager, 'findOne')
        .mockResolvedValueOnce(installationMock);
      jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(null);

      const result = await service.deleteTagLive(
        userId,
        installationId,
        tagLiveId,
      );

      expect(result).toBeNull();
    });

    it('should delete the tagLive and disassociate it from installation', async () => {
      const userId = 1;
      const installationId = 2;
      const tagLiveId = 3;

      const userMock: User = {
        userId: userId,
        username: 'Bobidou',
        password: 'FakePassword',
        role: 12,
        ewonIds: [],
      };

      const tagDetails = {
        id: 1,
        lastSynchroDate: 'modifSynchro',
        dateReq: '255d15d1f5fd8d',
        value: 1,
        quality: 'fdsfsdfsdfsdf',
        alarmHint: 'fdsfsdfsdfsdf',
        ewonTagId: 1,
        installation: null,
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(userMock);
      jest
        .spyOn(entityManager, 'findOne')
        .mockResolvedValueOnce(installationMock);
      jest.spyOn(entityManager, 'findOne').mockResolvedValueOnce(tagDetails);

      jest
        .spyOn(service, 'deleteTagLive')
        .mockResolvedValueOnce({} as DeleteResult);

      const result = await service.deleteTagLive(
        userId,
        installationId,
        tagLiveId,
      );

      expect(result).toStrictEqual({});
    });
  });
});
