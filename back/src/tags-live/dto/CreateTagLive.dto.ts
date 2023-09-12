import { ApiProperty } from '@nestjs/swagger';
import { Installation } from '../../entity/Installations.entity';
export class CreateTagLiveDto {
  @ApiProperty({ default: 'dateRandom' })
  lastSynchroDate: string;
  @ApiProperty({ default: 'dateRandom' })
  dateReq: string;
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
}
