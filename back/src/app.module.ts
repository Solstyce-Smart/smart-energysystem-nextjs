import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Installation } from './entity/Installations.entity';
import { TagsLive } from './entity/TagsLive.entity';
import { User } from './entity/Users.entity';
import { UsersModule } from './users/users.module';
import { InstallationsModule } from './installations/installations.module';
import { TagsLiveModule } from './tags-live/tags-live.module';

@Module({
  imports: [
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
