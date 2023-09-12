import { Module } from '@nestjs/common';
import { TagsLiveController } from './tags-live.controller';
import { TagsLiveService } from './tags-live.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsLive } from '../entity/TagsLive.entity';
import { Installation } from '../entity/Installations.entity';
import { User } from '../entity/Users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TagsLive, Installation, User])],
  providers: [TagsLiveService],
  controllers: [TagsLiveController],
})
export class TagsLiveModule {}
