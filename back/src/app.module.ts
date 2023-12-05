import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installation } from './entity/Installations.entity';
import { TagsLive } from './entity/TagsLive.entity';
import { User } from './entity/Users.entity';
import { UsersModule } from './users/users.module';
import { InstallationsModule } from './installations/installations.module';
import { TagsLiveModule } from './tags-live/tags-live.module';
import { SearchModule } from './search/search.module';
import { UserInstallationModule } from './user-installation/user-installation.module';
import Joi from 'joi';
import dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        ELASTICSEARCH_URL: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        ELASTICSEARCH_NODE: Joi.number().required(),
        PORT: Joi.number(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: 3306,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      entities: [User, Installation, TagsLive],
      synchronize: true,
    }),
    UsersModule,
    InstallationsModule,
    TagsLiveModule,
    SearchModule,
    UserInstallationModule,
  ],
})
export class AppModule {}
