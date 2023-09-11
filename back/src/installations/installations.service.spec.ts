import { Test, TestingModule } from '@nestjs/testing';
import { InstallationsService } from './installations.service';
import { Installation } from '../entity/Installations';
import { Repository, EntityManager } from 'typeorm';
import { InstallationsController } from './installations.controller';
import { getEntityManagerToken, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entity/Users';

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
          useClass: Repository, // Utilisez un objet mock pour UserRepository
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
});
