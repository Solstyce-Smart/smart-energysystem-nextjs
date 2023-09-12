import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Installation } from '../entity/Installations.entity';
import { Repository, EntityManager } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import {
  CreateInstallationParams,
  UpdateInstallationParams,
} from './types/types';
import { User } from '../entity/Users.entity';

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

    const newInstallation = new Installation();
    newInstallation.ewonId = installationDetails.ewonId;
    newInstallation.name = installationDetails.name;
    newInstallation.nbIRVE = installationDetails.nbIRVE;
    newInstallation.battery = installationDetails.battery;
    newInstallation.abo = installationDetails.abo;
    newInstallation.address = installationDetails.address;
    newInstallation.lastSynchroDate = installationDetails.lastSynchroDate;

    newInstallation.user = user;

    const savedData = await this.entityManager.transaction(
      async (transactionalEntityManager) => {
        const savedUser = await transactionalEntityManager.save(User, user);
        const savedInstallation = await transactionalEntityManager.save(
          Installation,
          newInstallation,
        );
        return { savedUser, savedInstallation };
      },
    );

    return {
      newInstallation: savedData.savedInstallation,
      user: savedData.savedUser,
    };
  }

  async getInstallationById(userId: number, installationId: number) {
    const user = await this.entityManager.findOne(User, {
      where: { userId: userId },
      relations: ['ewonIds'],
    });

    if (!user) {
      return null;
    }

    const installation = await user.ewonIds.find(
      (ewonId) => ewonId.id === installationId,
    );

    if (!installation) {
      return null;
    }

    const installationWithTagsLive = await this.entityManager.findOne(
      Installation,
      {
        where: { id: installationId },
        relations: ['tagsLive'],
      },
    );

    return installationWithTagsLive;
  }

  async getAllInstallations(userId: number) {
    const user = await this.entityManager.findOne(User, {
      where: { userId: userId },
      relations: ['ewonIds'],
    });

    if (!user) {
      return null;
    }

    return user.ewonIds;
  }

  async updateInstallationById(
    userId: number,
    installationId: number,
    installationDetails: UpdateInstallationParams,
  ) {
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

    const updatedInstallation = await this.installationRepository.save({
      ...installation,
      ...installationDetails,
    });

    return updatedInstallation;
  }

  async deleteInstallationById(userId: number, installationId: number) {
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

    await this.installationRepository.delete(installationId);

    return installation;
  }
}
