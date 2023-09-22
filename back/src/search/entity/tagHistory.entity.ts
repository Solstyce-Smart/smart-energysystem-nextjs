import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('tags_history')
export class TagsHistory {
  @PrimaryColumn()
  ewonId: string;

  @Column()
  lastSynchroDate: string;

  @Column()
  tagName: string;

  @Column()
  dateReq: string;

  @Column()
  value: number;

  @Column()
  quality: string;
}
