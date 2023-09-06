import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../entity/Users';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersController } from './users.controller';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
      controllers: [UsersController],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const userToCreate = {
      username: 'toto',
      password: 'toto',
    };

    const userCreated = new User();

    const createSpy = jest
      .spyOn(userRepository, 'create')
      .mockReturnValue(userCreated);

    const saveSpy = jest
      .spyOn(userRepository, 'save')
      .mockResolvedValue(userCreated);

    const result = await service.createUser(userToCreate);

    expect(createSpy).toHaveBeenCalledWith(userToCreate);

    expect(saveSpy).toHaveBeenCalled();

    expect(result).toEqual(userCreated);
  });
  it('should create a roled user', async () => {
    const userToCreate = {
      username: 'toto',
      password: 'toto',
      role: 3,
    };

    const userCreated = new User();

    const createSpy = jest
      .spyOn(userRepository, 'create')
      .mockReturnValue(userCreated);

    const saveSpy = jest
      .spyOn(userRepository, 'save')
      .mockResolvedValue(userCreated);

    const result = await service.createUser(userToCreate);

    expect(createSpy).toHaveBeenCalledWith(userToCreate);

    expect(saveSpy).toHaveBeenCalled();

    expect(result).toEqual(userCreated);
  });
  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        {
          userId: 1,
          username: 'User 1',
          password: 'fakePassword',
          role: 1,
          ewonIds: ['1', '2'],
        },
        {
          userId: 2,
          username: 'User 2',
          password: 'fakePassword',
          role: 3,
          ewonIds: ['4', '5'],
        },
      ];

      const getAllUsersSpy = jest
        .spyOn(userRepository, 'find')
        .mockResolvedValue(users);

      const result = await controller.getAllUsers();

      expect(getAllUsersSpy).toHaveBeenCalled();

      expect(result).toEqual(users);
    });
  });
});
