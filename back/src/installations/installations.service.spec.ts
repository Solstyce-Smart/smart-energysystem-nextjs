import { Test, TestingModule } from '@nestjs/testing';
import { InstallationsService } from './installations.service';
import { Installation } from '../entity/Installations.entity';
import { Repository, EntityManager, getManager } from 'typeorm';
import { InstallationsController } from './installations.controller';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entity/Users.entity';
import { CreateInstallationParams } from './types/types';
import { TagsLive } from '../entity/TagsLive.entity';

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
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  const installationMock: Installation = {
    id: 26,
    ewonId: 'hakunamatutu',
    name: 'centrale',
    nbIRVE: 4,
    battery: true,
    abo: 2,
    lastSynchroDate: new Date('2023-09-20T07:58:59Z'),
    address: [
      {
        address: '3 rue des machins',
        latitude: 'fdsfsfdsfsf',
        longitude: 'fdsfsdfsdfsdf',
        postalCode: 215882,
      },
    ],
    tagsLive: [],
    user: null,
  } as Installation;

  const tagsLiveMock: TagsLive[] = [
    {
      id: 1,
      lastSynchroDate: new Date('2023-09-20T07:58:59Z'),
      dateReq: new Date('2023-09-20T07:58:59Z'),
      value: 1,
      quality: 'fdsfsdfsdfsdf',
      alarmHint: 'fdsfsdfsdfsdf',
      ewonTagId: 1,
      installation: installationMock,
      toJSON() {
        const { installation, ...rest } = this;
        return rest;
      },
    },
  ];

  installationMock.tagsLive = tagsLiveMock;

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
        lastSynchroDate: new Date('2023-09-20T07:58:59Z'),
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

      // Créez un espion pour getManager
      const getManagerSpy = jest.spyOn(getManager(), 'transaction');

      // Créez un faux entityManager
      const entityManagerMock: EntityManager = {
        transaction: jest.fn().mockImplementation(async (callback) => {
          const savedUser = await callback(entityManagerMock);
          return savedUser;
        }),
        save: jest.fn().mockResolvedValue(installationDetails),
      } as any;

      getManagerSpy.mockResolvedValue(entityManagerMock);

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(userMock);

      const result = await service.createInstallation(
        userId,
        installationDetails,
      );

      expect(result).toEqual(installationDetails);

      // Assurez-vous que la méthode transaction a été appelée
      expect(getManagerSpy).toHaveBeenCalled();
    });
  });
  describe('getInstallationById', () => {
    it('should return null if user is not found', async () => {
      const userId = 1;
      const installationId = 1;

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(null);

      const result = await service.getInstallationById(userId, installationId);

      expect(result).toBeNull();
    });

    it('should return null if installation is not found', async () => {
      const userId = 1;
      const installationId = 1;

      const user: User = {
        userId: userId,
        username: 'TestUser',
        password: 'test',
        role: 1,
        ewonIds: [],
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(user);

      const result = await service.getInstallationById(userId, installationId);

      expect(result).toBeNull();
    });
    it('should return the installation if found', async () => {
      const userId = 1;
      const installationId = 1;

      const installation: Installation = {
        id: installationId,
        ewonId: 'testEwonId',
        name: 'Test Installation',
        nbIRVE: 4,
        battery: true,
        abo: 2,
        lastSynchroDate: new Date('2023-09-20T07:58:59Z'),
        tagsLive: tagsLiveMock,
        user: null,
      } as Installation;

      jest
        .spyOn(entityManager, 'findOne')
        .mockImplementation(async (entity: any, options: any) => {
          if (entity === User && options?.where?.userId === userId) {
            return {
              userId,
              username: 'TestUser',
              password: 'test',
              role: 1,
              ewonIds: [installation],
            };
          }
          if (
            entity === Installation &&
            options?.where?.id === installationId
          ) {
            return installation;
          }
          return null;
        });

      const result = await service.getInstallationById(userId, installationId);

      expect(result).toEqual(installation);
    });
  });

  describe('getAllInstallations', () => {
    it('should return null if user is not found', async () => {
      const userId = 1;

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(null);

      const result = await service.getAllInstallations(userId);

      expect(result).toBeNull();
    });

    it('should return user installations if user is found', async () => {
      const userId = 1;
      const userMock: User = {
        userId: userId,
        username: 'Bobidou',
        password: 'FakePassword',
        role: 12,
        ewonIds: [],
      };

      const installations: Installation[] = [
        {
          id: 1,
          ewonId: 'testEwonId1',
          name: 'Installation 1',
          nbIRVE: 4,
          battery: true,
          abo: 2,
          lastSynchroDate: new Date('2023-09-20T07:58:59Z'),
          tagsLive: tagsLiveMock,
          user: userMock,
        } as Installation,
        {
          id: 2,
          ewonId: 'testEwonId2',
          name: 'Installation 2',
          nbIRVE: 3,
          battery: false,
          abo: 1,
          lastSynchroDate: new Date('2023-09-20T07:58:59Z'),
          tagsLive: tagsLiveMock,
          user: userMock,
        } as Installation,
      ];

      const user: User = {
        userId: userId,
        username: 'TestUser',
        password: 'test',
        role: 1,
        ewonIds: installations,
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(user);

      const result = await service.getAllInstallations(userId);

      expect(result).toEqual(installations);
    });
  });
  describe('updateInstallationById', () => {
    it('should return null if user is not found', async () => {
      const userId = 1;
      const installationId = 1;

      const userMock: User = {
        userId: userId,
        username: 'Bobidou',
        password: 'FakePassword',
        role: 12,
        ewonIds: [],
      };
      const installationDetails = {
        id: 26,
        ewonId: 'hakunamatotu',
        name: 'centrale',
        nbIRVE: 4,
        battery: true,
        address: [
          {
            address: '3 rue des trucs',
            postalCode: 215882,
            latitude: 'fdsfsfdsfsf',
            longitude: 'fdsfsdfsdfsdf',
          },
        ],
        abo: 2,
        lastSynchroDate: new Date('2023-09-20T07:58:59Z'),
        tagsLive: tagsLiveMock,
        user: userMock,
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(null);

      const result = await service.updateInstallationById(
        userId,
        installationId,
        installationDetails,
      );

      expect(result).toBeNull();
    });

    it('should return null if installation is not found', async () => {
      const userId = 1;
      const installationId = 1;

      const userMock: User = {
        userId: userId,
        username: 'Bobidou',
        password: 'FakePassword',
        role: 12,
        ewonIds: [],
      };
      const installationDetails = {
        id: 26,
        ewonId: 'hakunamatotu',
        name: 'centrale',
        nbIRVE: 4,
        battery: true,
        address: [
          {
            address: '3 rue des trucs',
            postalCode: 215882,
            latitude: 'fdsfsfdsfsf',
            longitude: 'fdsfsdfsdfsdf',
          },
        ],
        abo: 2,
        lastSynchroDate: new Date('2023-09-20T07:58:59Z'),
        tagsLive: tagsLiveMock,
        user: userMock,
      };

      const user: User = {
        userId: userId,
        username: 'TestUser',
        password: 'test',
        role: 1,
        ewonIds: [],
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(user);

      const result = await service.updateInstallationById(
        userId,
        installationId,
        installationDetails,
      );

      expect(result).toBeNull();
    });

    it('should return the updated installation if user and installation are found', async () => {
      const userId = 1;
      const installationId = 1;

      const userMock: User = {
        userId: userId,
        username: 'Bobidou',
        password: 'FakePassword',
        role: 12,
        ewonIds: [],
      };
      const installationDetails: Installation = new Installation();
      (installationDetails.id = 26),
        (installationDetails.ewonId = 'hakunamatotu'),
        (installationDetails.name = 'centrale'),
        (installationDetails.nbIRVE = 4),
        (installationDetails.battery = true),
        (installationDetails.address = [
          {
            address: '3 rue des trucs',
            postalCode: 215882,
            latitude: 'fdsfsfdsfsf',
            longitude: 'fdsfsdfsdfsdf',
          },
        ]),
        (installationDetails.abo = 2),
        (installationDetails.lastSynchroDate = new Date(
          '2023-09-20T07:58:59Z',
        )),
        (installationDetails.tagsLive = tagsLiveMock),
        (installationDetails.user = userMock);

      const installation: Installation = new Installation();
      (installation.id = installationId),
        (installation.ewonId = 'testEwonId'),
        (installation.name = 'Test Installation'),
        (installation.nbIRVE = 4),
        (installation.battery = true),
        (installation.abo = 2),
        (installation.lastSynchroDate = new Date('2023-09-20T07:58:59Z')),
        (installation.tagsLive = tagsLiveMock),
        (installation.user = userMock);

      const user: User = {
        userId: userId,
        username: 'TestUser',
        password: 'test',
        role: 1,
        ewonIds: [installation],
      };

      const updatedInstallation: Installation = {
        ...installation,
        ...installationDetails,
      } as Installation;

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(installationRepository, 'save')
        .mockResolvedValue(updatedInstallation);

      const result = await service.updateInstallationById(
        userId,
        installationId,
        installationDetails,
      );

      expect(result).toEqual(updatedInstallation);
    });
  });
  describe('deleteInstallationById', () => {
    it('should return the deleted installation if user and installation are found', async () => {
      const userId = 1;
      const installationId = 1;

      const userMock: User = {
        userId: userId,
        username: 'Bobidou',
        password: 'FakePassword',
        role: 12,
        ewonIds: [],
      };

      const installation: Installation = {
        id: installationId,
        ewonId: 'testEwonId',
        name: 'Test Installation',
        nbIRVE: 4,
        battery: true,
        abo: 2,
        lastSynchroDate: new Date('2023-09-20T07:58:59Z'),
        tagsLive: tagsLiveMock,
        user: userMock,
      } as Installation;

      const user: User = {
        userId: userId,
        username: 'TestUser',
        password: 'test',
        role: 1,
        ewonIds: [installation],
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(installationRepository, 'delete')
        .mockResolvedValue({ raw: [], affected: 1 });

      const result = await service.deleteInstallationById(
        userId,
        installationId,
      );

      expect(result).toEqual(installation);
    });

    it('should return null if user is not found', async () => {
      const userId = 1;
      const installationId = 1;

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(null);

      const result = await service.deleteInstallationById(
        userId,
        installationId,
      );

      expect(result).toBeNull();
    });

    it('should return null if installation is not found', async () => {
      const userId = 1;
      const installationId = 1;

      const user: User = {
        userId: userId,
        username: 'TestUser',
        password: 'test',
        role: 1,
        ewonIds: [],
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(user);

      const result = await service.deleteInstallationById(
        userId,
        installationId,
      );

      expect(result).toBeNull();
    });

    it('should return null if the installation delete operation fails', async () => {
      const userId = 1;
      const installationId = 99999;

      const userMock: User = {
        userId: userId,
        username: 'Bobidou',
        password: 'FakePassword',
        role: 12,
        ewonIds: [],
      };

      const installation: Installation = {
        id: 1,
        ewonId: 'testEwonId',
        name: 'Test Installation',
        nbIRVE: 4,
        battery: true,
        abo: 2,
        lastSynchroDate: new Date('2023-09-20T07:58:59Z'),
        tagsLive: tagsLiveMock,
        user: userMock,
      } as Installation;

      const user: User = {
        userId: userId,
        username: 'TestUser',
        password: 'test',
        role: 1,
        ewonIds: [installation],
      };

      jest.spyOn(entityManager, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(installationRepository, 'delete')
        .mockRejectedValue(new Error('Deletion failed'));

      const result = await service.deleteInstallationById(
        userId,
        installationId,
      );

      expect(result).toBeNull();
    });
  });
});
