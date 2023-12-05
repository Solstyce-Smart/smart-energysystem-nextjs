import { Test, TestingModule } from '@nestjs/testing';
import { UserInstallationService } from './user-installation.service';

describe('UserInstallationService', () => {
  let service: UserInstallationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserInstallationService],
    }).compile();

    service = module.get<UserInstallationService>(UserInstallationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
