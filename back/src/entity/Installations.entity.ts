import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { TagsLive } from './TagsLive.entity';
import { User } from './Users.entity';

@Entity('installation')
export class Installation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ewonId: string;

  @Column()
  name: string;

  @Column()
  nbIRVE: number;

  @Column()
  battery: boolean;

  @Column()
  abo: number;

  @Column()
  lastSynchroDate: string;

  @Column('json', { nullable: true })
  address?: {
    address: string;
    postalCode: number;
    latitude: string;
    longitude: string;
  }[];

  @OneToOne(() => TagsLive)
  @JoinColumn()
  tagsLive?: TagsLive;

  @ManyToOne(() => User, (user) => user.ewonIds, {
    onDelete: 'CASCADE',
  })
  user: User;
}