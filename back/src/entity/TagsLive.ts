import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Installation } from './Installations';

@Entity('tags_live')
export class TagsLive {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  lastSynchroDate: string;

  @Column()
  dateReq: string;

  @Column()
  value: number;

  @Column()
  quality: string;

  @Column()
  alarmHint: string;

  @Column()
  ewonTagId: number;

  @OneToOne(() => Installation)
  @JoinColumn()
  installation: Installation;
}
