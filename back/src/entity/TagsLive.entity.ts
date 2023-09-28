import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { Installation } from './Installations.entity';

@Entity('tags_live')
export class TagsLive {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastSynchroDate: Date;

  @Column()
  dateReq: Date;

  @Column()
  value: number;

  @Column()
  quality: string;

  @Column()
  alarmHint: string;

  @Column()
  ewonTagId: number;

  @ManyToOne(() => Installation, (installation) => installation.tagsLive, {
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: () => Installation })
  installation: Installation;

  toJSON() {
    const { installation, ...rest } = this;
    return rest;
  }
}
