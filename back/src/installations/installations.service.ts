import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Installation } from '../entity/Installations.entity';
import { Repository, EntityManager } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { classToPlain, plainToClass } from 'class-transformer';
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

  async createInstallation(installationDetails: CreateInstallationParams) {
    const user = await this.entityManager.findOne(User, {
      where: { userId: 1 },
      relations: ['installations'],
    });

    const newInstallation = new Installation();
    newInstallation.ewonId = installationDetails.ewonId;
    newInstallation.name = installationDetails.name;
    newInstallation.abo = installationDetails.abo;
    newInstallation.address = installationDetails.address;
    newInstallation.lastSynchroDate = installationDetails.lastSynchroDate;
    newInstallation.tarifs = installationDetails.tarifs;
    newInstallation.user = [user];

    const installationToReturn = await this.entityManager.save(
      Installation,
      newInstallation,
    );
    user.installations.push(installationToReturn);

    // Exclure les relations qui pourraient causer une boucle infinie
    const plainInstallation = classToPlain(installationToReturn) as Record<
      string,
      any
    >;
    return plainToClass(Installation, plainInstallation);
  }

  async getInstallationById(installationId: number) {
    const installation = await this.entityManager.findOne(Installation, {
      where: { installationId },
      relations: ['tagsLive', 'user'],
    });

    if (!installation) {
      return null;
    }

    const installationWithTagsLive = await this.entityManager.findOne(
      Installation,
      {
        where: { installationId },
        relations: ['tagsLive', 'user'],
      },
    );

    return installationWithTagsLive;
  }

  async getAllInstallations() {
    const installations = await this.entityManager.find(Installation, {
      relations: ['tagsLive', 'user'],
    });

    return installations;
  }

  async updateInstallationById(
    installationId: number,
    installationDetails: UpdateInstallationParams,
  ) {
    const installation = await this.entityManager.findOne(Installation, {
      where: { installationId },
    });

    if (!installation) {
      return null;
    }

    const updatedInstallation = await this.installationRepository.save({
      ...installation,
      ...installationDetails,
    });

    return updatedInstallation;
  }

  async deleteInstallationById(installationId: number) {
    const installations = await this.entityManager.find(Installation, {
      relations: ['tagsLive', 'user'],
    });

    const installation = installations.find(
      (ewonId) => ewonId.installationId === installationId,
    );

    if (!installation) {
      return null;
    }

    await this.installationRepository.delete(installationId);

    return installation;
  }
}
