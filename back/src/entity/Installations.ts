import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { TagsLive } from './TagsLive';

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

  @Column({ type: 'timestamp' })
  lastSynchroDate: Date;

  @Column('json', { nullable: true })
  address: {
    address: string;
    postalCode: number;
    latitude: string;
    longitude: string;
  }[];

  @Column('json', { nullable: true })
  tagHistory: {
    lastSynchroDate: Date;
    dateReq: Date;
    value: number;
    quality: string;
    alarmHint: string;
  }[];

  @OneToOne(() => TagsLive)
  tagsLive: TagsLive;
}
