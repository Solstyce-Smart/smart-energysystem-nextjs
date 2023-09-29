import { ApiProperty } from '@nestjs/swagger';
import { Installation } from '../../entity/Installations.entity';
export class UpdateTagLiveDto {
  @ApiProperty()
  _id?: string;
  @ApiProperty()
  id: number;
  @ApiProperty({ default: 'Tag Name' })
  name: string;
  @ApiProperty({ default: '2023-09-20T07:58:59Z' })
  lastSynchroDate: Date;
  @ApiProperty({ default: '2023-09-20T07:58:59Z' })
  dateReq: Date;
  @ApiProperty({ default: 1 })
  value: number;
  @ApiProperty({ default: 'Good' })
  quality: string;
  @ApiProperty({ default: "Pas d'alarmes" })
  alarmHint: string;
  @ApiProperty({ default: 27 })
  ewonTagId: number;
  @ApiProperty({ type: () => [Installation], readOnly: true })
  installation: null;

  toJSON() {
    const { installation, ...rest } = this;
    return rest;
  }
}
