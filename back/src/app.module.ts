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
import * as Joi from 'joi';
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
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test_db',
      entities: [User, Installation, TagsLive],
      synchronize: true,
    }),
    UsersModule,
    InstallationsModule,
    TagsLiveModule,
    SearchModule,
  ],
})
export class AppModule {}
