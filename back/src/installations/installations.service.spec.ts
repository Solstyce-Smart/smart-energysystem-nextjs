import { Test, TestingModule } from '@nestjs/testing';
import { InstallationsService } from './installations.service';
import { Installation } from '../entity/Installations';
import { Repository, EntityManager } from 'typeorm';
import { InstallationsController } from './installations.controller';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entity/Users';
import { CreateInstallationParams } from './types/types';

describe('InstallationsService', () => {
  let service: InstallationsService;
  let installationRepository: Repository<Installation>;
  let controller: InstallationsController;
  let entityManager: EntityManager;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstallationsService,
        {
          provide: getRepositoryToken(Installation),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getEntityManagerToken(),
          useClass: EntityManager,
        },
      ],
      controllers: [InstallationsController],
    }).compile();

    service = module.get<InstallationsService>(InstallationsService);
    installationRepository = module.get<Repository<Installation>>(
      getRepositoryToken(Installation),
    );
    controller = module.get<InstallationsController>(InstallationsController);
    entityManager = module.get<EntityManager>(EntityManager);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User)); // Injectez UserRepository
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInstallation', () => {
    it('should create a new installation', async () => {
      const userId = 1;

      const userMock: User = {
        userId: userId,
        username: 'Bobidou',
        password: 'FakePassword',
        role: 12,
        ewonIds: [],
      };
      const installationDetails: CreateInstallationParams = {
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
        tagsLive: 'fdsfsdfsdfsdf',
        user: userMock,
      };

      const tagsLiveMock = {
        id: 1,
        lastSynchroDate: '255d15d1f5fd8d',
        dateReq: '255d15d1f5fd8d',
        value: 1,
        quality: 'fdsfsdfsdfsdf',
        alarmHint: 'fdsfsdfsdfsdf',
        ewonTagId: 1,
      };

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
        tagsLive: tagsLiveMock,
        user: userMock,
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(userMock);
      jest
        .spyOn(installationRepository, 'create')
        .mockReturnValue(installationMock);
      jest.spyOn(userRepository, 'save').mockResolvedValue(userMock);
      jest
        .spyOn(installationRepository, 'save')
        .mockResolvedValue(installationMock);

      const result = await service.createInstallation(
        userId,
        installationDetails,
      );

      expect(result).toEqual({
        newInstallation: installationMock,
        user: userMock,
      });
    });

    it('should handle the case when the user is not found', async () => {
      jest.spyOn(entityManager, 'findOne').mockResolvedValue(undefined);

      const userId = 1;

      const userMock: User = {
        userId: userId,
        username: 'Bobidou',
        password: 'FakePassword',
        role: 12,
        ewonIds: [],
      };
      const installationDetails: CreateInstallationParams = {
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
        tagsLive: 'fdsfsdfsdfsdf',
        user: userMock,
      };

      const tagsLiveMock = {
        id: 1,
        lastSynchroDate: '255d15d1f5fd8d',
        dateReq: '255d15d1f5fd8d',
        value: 1,
        quality: 'fdsfsdfsdfsdf',
        alarmHint: 'fdsfsdfsdfsdf',
        ewonTagId: 1,
      };

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
        tagsLive: tagsLiveMock,
        user: userMock,
      };

      const result = await service.createInstallation(
        userId,
        installationDetails,
      );

      expect(result).toBeNull();
    });
  });
});
