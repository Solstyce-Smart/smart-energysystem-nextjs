import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import { User } from '../entity/Users.entity';
import { Installation } from '../entity/Installations.entity';
import { UserInstallation } from '../entity/UserInstallation.entity';

@Injectable()
export class UserInstallationService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserInstallation)
    private readonly userInstallationRepository: Repository<UserInstallation>,
    @InjectRepository(Installation)
    private readonly installationRepository: Repository<Installation>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async linkUserToInstallation(
    userId: number,
    installationId: number,
  ): Promise<boolean> {
    const user = await this.entityManager.findOne(User, {
      where: { userId },
      relations: ['installations'],
    });

    if (!user) {
      return false;
    }

    const installation = await this.entityManager.findOne(Installation, {
      where: { installationId },
      relations: ['user', 'tagsLive'],
    });

    if (!installation) {
      return false;
    }
    // console.log(user.installations);
    console.log(installation.user);
    console.log(user.installations);

    user.installations.push(installation);

    installation.user.push(user);

    // Enregistrez les changements dans la base de données
    await this.installationRepository.save(installation);
    await this.userRepository.save(user);

    return true;
  }
}
