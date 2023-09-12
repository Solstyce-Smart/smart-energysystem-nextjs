import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Installation } from '../entity/Installations.entity';
import { Repository, EntityManager } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/Users.entity';
import { TagsLive } from '../entity/TagsLive.entity';
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
    createTagLiveParams: CreateTagLiveParams,
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

    const newTagLive = this.tagsLiveRepository.create({
      lastSynchroDate: createTagLiveParams.lastSynchroDate,
      dateReq: createTagLiveParams.dateReq,
      value: createTagLiveParams.value,
      quality: createTagLiveParams.quality,
      alarmHint: createTagLiveParams.alarmHint,
      ewonTagId: createTagLiveParams.ewonTagId,
    });

    installation.tagsLive = newTagLive;

    await this.userRepository.save(user);
    await this.tagsLiveRepository.save(newTagLive);
    await this.installationRepository.save(installation);

    return newTagLive;
  }

  async updateTagLive(
    userId: number,
    installationId: number,
    tagLiveId: number,
    updateTagLiveParams: UpdateTagLiveParams,
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

    tagLive.lastSynchroDate = updateTagLiveParams.lastSynchroDate;
    tagLive.dateReq = updateTagLiveParams.dateReq;
    tagLive.value = updateTagLiveParams.value;
    tagLive.quality = updateTagLiveParams.quality;
    tagLive.alarmHint = updateTagLiveParams.alarmHint;
    tagLive.ewonTagId = updateTagLiveParams.ewonTagId;

    await this.tagsLiveRepository.save(tagLive);

    return tagLive;
  }

  async deleteTagLive(
    userId: number,
    installationId: number,
    tagLiveId: number,
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

    installation.tagsLive = null;

    await this.userRepository.save(user);
    await this.installationRepository.save(installation);
    await this.tagsLiveRepository.delete(tagLiveId);

    return null;
  }
}
