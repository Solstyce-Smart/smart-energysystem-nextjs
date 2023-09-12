import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Installation } from '../entity/Installations';
import { Repository, EntityManager } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/Users';
import { TagsLive } from '../entity/TagsLive';
import { CreateTagLiveParams, UpdateTagLiveParams } from './types/types';

@Injectable()
export class TagsLiveService {
  constructor(
    @InjectRepository(TagsLive)
    private tagsLiveRepository: Repository<TagsLive>,
    @InjectRepository(Installation)
    private installationRepository: Repository<Installation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {}
  async getTagsLive(userId: number, installationId: number) {
    const user = await this.entityManager.findOne(User, {
      where: { userId: userId },
    });

    if (!user) {
      return null;
    }

    const installation = await this.entityManager.findOne(Installation, {
      where: { id: installationId },
      relations: ['tagsLive'],
    });

    if (!installation) {
      return null;
    }

    return installation.tagsLive;
  }

  async createTagLive(
    userId: number,
    installationId: number,
    CreateTagLiveParams: CreateTagLiveParams,
  ) {
    const user = await this.entityManager.findOne(User, {
      where: { userId: userId },
    });

    if (!user) {
      return null;
    }

    const installation = await this.entityManager.findOne(Installation, {
      where: { id: installationId },
      relations: ['tagsLive'],
    });

    if (!installation) {
      return null;
    }
    const newTagLive = this.tagsLiveRepository.create(CreateTagLiveParams);

    installation.tagsLive = newTagLive;

    await this.userRepository.save(user);
    await this.installationRepository.save(installation);
    await this.tagsLiveRepository.save(newTagLive);

    return newTagLive;
  }

  async updateTagLive(
    userId: number,
    installationId: number,
    tagLiveId: number,
    UpdateTagLiveParams: UpdateTagLiveParams,
  ) {
    const user = await this.entityManager.findOne(User, {
      where: { userId: userId },
    });

    if (!user) {
      return null;
    }

    const installation = await this.entityManager.findOne(Installation, {
      where: { id: installationId },
      relations: ['tagsLive'],
    });

    if (!installation) {
      return null;
    }

    const tagLive = await this.entityManager.findOne(TagsLive, {
      where: { id: tagLiveId },
    });

    if (!tagLive) {
      return null;
    }

    const updatedTagLive = this.tagsLiveRepository.create(UpdateTagLiveParams);

    installation.tagsLive = updatedTagLive;

    await this.userRepository.save(user);
    await this.installationRepository.save(installation);
    await this.tagsLiveRepository.save(updatedTagLive);

    return updatedTagLive;
  }
}
