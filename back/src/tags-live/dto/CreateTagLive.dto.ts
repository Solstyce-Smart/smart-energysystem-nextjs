import { ApiProperty } from '@nestjs/swagger';
import { Installation } from '../../entity/Installations.entity';
export class CreateTagLiveDto {
  @ApiProperty({ default: 'dateRandom' })
  lastSynchroDate: string;
  @ApiProperty({ default: Date.now() })
  dateReq: Date;
  @ApiProperty({ default: 1 })
  value: number;
  @ApiProperty({ default: 'Good' })
  quality: string;
  @ApiProperty({ default: "Pas d'alarmes" })
  alarmHint: string;
  @ApiProperty({ default: 'IRVE_1' })
  tagName: string;
  @ApiProperty({ type: () => [Installation], readOnly: true })
  installation: null;
}
