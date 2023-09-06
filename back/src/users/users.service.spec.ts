import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../entity/Users';
import { Repository, UpdateResult } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UpdateUserDto } from './dto/UpdateUser.dto';

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

  //Method POST
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
  //Method POST
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
  //Method GET
  it('should get all the users', async () => {
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
  //Method GET
  it('should return a user with userId, username, role, and ewonIds', async () => {
    const userIdToGet = 2;

    const userToReturn: User = {
      userId: 2,
      username: 'Lilian',
      password: 'test',
      role: 1,
      ewonIds: ['dfsfsdfsdf', '4ds58d485ds4d84sd8s4'],
    };

    const findOneSpy = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(userToReturn);

    const result = await controller.getOneUser(userIdToGet);

    expect(findOneSpy).toHaveBeenCalledWith({
      where: { userId: userIdToGet },
      select: ['userId', 'username', 'role', 'ewonIds', 'password'],
    });

    expect(result).toEqual(userToReturn);
  });

  it('should return null if the user is not found', async () => {
    const userIdToGet = 999;

    const findOneSpy = jest
      .spyOn(userRepository, 'findOne')
      .mockResolvedValue(null);

    const result = await controller.getOneUser(userIdToGet);

    expect(findOneSpy).toHaveBeenCalledWith({
      where: { userId: userIdToGet },
      select: ['userId', 'username', 'role', 'ewonIds', 'password'],
    });

    expect(result).toBeNull();
  });
  it('should update a user by ID and return the updated user', async () => {
    const userId = 1;
    const updateUserDto: UpdateUserDto = {
      username: 'John',
      password: 'testito',
      role: 3,
      ewonIds: ['1', '2'],
    };

    const updatedUser: User | null = {
      userId: 1,
      username: updateUserDto.username,
      password: updateUserDto.password,
      role: updateUserDto.role,
      ewonIds: updateUserDto.ewonIds,
    };

    const updateUserSpy = jest
      .spyOn(service, 'updateUser')
      .mockResolvedValue(updatedUser);

    const result = await controller.updateUserById(userId, updateUserDto);

    expect(updateUserSpy).toHaveBeenCalledWith(userId, updateUserDto);

    expect(result).toEqual(updatedUser);
  });
});
