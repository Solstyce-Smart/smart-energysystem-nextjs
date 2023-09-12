import { Module } from '@nestjs/common';
import { InstallationsService } from './installations.service';
import { InstallationsController } from './installations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installation } from '../entity/Installations.entity';
import { User } from '../entity/Users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Installation, User])],
  providers: [InstallationsService],
  controllers: [InstallationsController],
})
export class InstallationsModule {}
