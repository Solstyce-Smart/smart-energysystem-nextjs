import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { Installation } from '../entity/Installations.entity';
import { Repository, EntityManager } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/Users.entity';
import { TagsLive } from '../entity/TagsLive.entity';
import { CreateTagLiveParams, UpdateTagLiveParams } from './types/types';
import { getEwon } from '../ewonApi/getEwon';

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
    const datas = await getEwon();

    if (!datas) {
      return null;
    }

    const installation = await this.entityManager.findOne(Installation, {
      where: { id: installationId },
      relations: ['tagsLive'],
    });

    if (!installation) {
      return null;
    }

    // Créez un tableau pour stocker les nouveaux enregistrements TagsLive
    const newTags: TagsLive[] = [];

    for (let i = 0; i < datas.tags.length; i++) {
      const newTagLive: CreateTagLiveParams = {
        id: datas.tags[i].id,
        lastSynchroDate: datas.lastSynchroDate,
        dateReq: new Date(),
        value: datas.tags[i].value,
        quality: datas.tags[i].quality,
        alarmHint: datas.tags[i].alarmHint,
        ewonTagId: datas.tags[i].ewonTagId,
        installation: installation, // Lien vers l'installation parente
      };

      newTags.push(newTagLive);
    }

    // Enregistrez tous les nouveaux enregistrements TagsLive en une seule opération
    await this.tagsLiveRepository.save(newTags);

    console.log(newTags);

    // Associez les enregistrements TagsLive à l'installation parente
    installation.tagsLive = newTags;

    // Enregistrez l'installation mise à jour
    await this.installationRepository.save(installation);

    // Retournez la liste des nouveaux enregistrements TagsLive
    return newTags;
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
