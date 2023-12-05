import { Test, TestingModule } from '@nestjs/testing';
import { UserInstallationController } from './user-installation.controller';

describe('UserInstallationController', () => {
  let controller: UserInstallationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserInstallationController],
    }).compile();

    controller = module.get<UserInstallationController>(UserInstallationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
