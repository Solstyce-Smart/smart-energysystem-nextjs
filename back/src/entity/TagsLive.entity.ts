import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Installation } from './Installations.entity';

@Entity('tags_live')
export class TagsLive {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'dateRandom', nullable: true })
  lastSynchroDate: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateReq: Date;

  @Column({ default: 0 })
  value: number;

  @Column({ default: 'Good' })
  quality: string;

  @Column({ default: '' })
  alarmHint: string;

  @Column({ default: 999 })
  ewonTagId: number;

  @ManyToOne(() => Installation, (installation) => installation.tagsLive, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: () => [Installation] })
  @JoinColumn()
  installation: Installation;
}
