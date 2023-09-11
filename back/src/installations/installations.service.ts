import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Installation } from '../entity/Installations';
import { Repository, EntityManager } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { CreateInstallationParams } from './types/types';
import { User } from '../entity/Users';

@Injectable()
export class InstallationsService {
  constructor(
    @InjectRepository(Installation)
    private installationRepository: Repository<Installation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}

  async createInstallation(
    userId: number,
    installationDetails: CreateInstallationParams,
  ) {
    const user = await this.entityManager.findOne(User, {
      where: { userId: userId },
      relations: ['ewonIds'],
    });
    if (!user) {
      return null;
    }

    const newInstallation =
      this.installationRepository.create(installationDetails);

    newInstallation.user = user;
    await this.userRepository.save(user);
    await this.installationRepository.save(newInstallation);

    return { newInstallation, user };
  }

  async getInstallationById(userId: number, installationId: number) {
    const user = await this.entityManager.findOne(User, {
      where: { userId: userId },
      relations: ['ewonIds'],
    });

    if (!user) {
      return null;
    }

    const installation = user.ewonIds.find(
      (ewonId) => ewonId.id === installationId,
    );

    if (!installation) {
      return null;
    }

    return installation;
  }
}
