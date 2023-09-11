import { Module } from '@nestjs/common';
import { TagsLiveController } from './tags-live.controller';
import { TagsLiveService } from './tags-live.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsLive } from '../entity/TagsLive';

@Module({
  imports: [TypeOrmModule.forFeature([TagsLive])],
  controllers: [TagsLiveController],
  providers: [TagsLiveService],
})
export class TagsLiveModule {}
