import { Module } from '@nestjs/common';
import { TagsLiveController } from './tags-live.controller';
import { TagsLiveService } from './tags-live.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsLive } from '../entity/TagsLive';
import { Installation } from '../entity/Installations';
import { User } from '../entity/Users';

@Module({
  imports: [TypeOrmModule.forFeature([TagsLive, Installation, User])],
  providers: [TagsLiveService],
  controllers: [TagsLiveController],
})
export class TagsLiveModule {}
