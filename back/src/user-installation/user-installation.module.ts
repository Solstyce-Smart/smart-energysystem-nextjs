import { Module } from '@nestjs/common';
import { UserInstallationService } from './user-installation.service';
import { UserInstallationController } from './user-installation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installation } from '../entity/Installations.entity';
import { User } from '../entity/Users.entity';
import { UserInstallation } from '../entity/UserInstallation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Installation, User, UserInstallation])],
  providers: [UserInstallationService],
  controllers: [UserInstallationController],
})
export class UserInstallationModule {}
