import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Installation } from './Installations.entity';

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

  @OneToOne(() => Installation, (installation) => installation.tagsLive, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: () => [Installation] })
  @JoinColumn()
  installation: Installation;
}
