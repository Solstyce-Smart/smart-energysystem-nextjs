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
    createTagLiveParams: CreateTagLiveParams[],
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

    if (!installation.tagsLive) {
      installation.tagsLive = [];
    }

    for (const params of createTagLiveParams) {
      const tagName = params.tagName;
      const existingTagsLive = installation.tagsLive.find(
        (tagLive) => tagLive.tagName === tagName,
      );
      if (existingTagsLive) {
        existingTagsLive.lastSynchroDate = params.lastSynchroDate;
        existingTagsLive.dateReq = new Date();
        existingTagsLive.value = params.value;
        existingTagsLive.quality = params.quality;
        existingTagsLive.alarmHint = params.alarmHint;
        await this.tagsLiveRepository.save(existingTagsLive);
      } else {
        const newTagLive = this.tagsLiveRepository.create({
          lastSynchroDate: params.lastSynchroDate,
          value: params.value,
          quality: params.quality,
          alarmHint: params.alarmHint,
          tagName: params.tagName,
          installation: installation,
        });

        installation.tagsLive.push(newTagLive);
        await this.tagsLiveRepository.save(newTagLive);
      }
    }

    await this.installationRepository.save(installation);
    await this.userRepository.save(user);

    return;
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
    tagLive.tagName = updateTagLiveParams.tagName;

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
