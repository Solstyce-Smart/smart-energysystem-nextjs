import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Installation } from './Installations';

@Entity('tags_live')
export class TagsLive {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp' })
  lastSynchroDate: Date;

  @Column({ type: 'timestamp' })
  dateReq: Date;

  @Column()
  value: number;

  @Column()
  quality: string;

  @Column()
  alarmHint: string;

  @Column()
  ewonTagId: number;
}
