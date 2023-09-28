import { ApiProperty } from '@nestjs/swagger';
export class PostDatasDto {
  @ApiProperty({ default: 'test' })
  ewonId: string;
  @ApiProperty({ default: 'IRVE1' })
  tagName: string;
  @ApiProperty({ default: '2023-09-01T10:48:50Z' })
  lastSynchroDate: Date;
  @ApiProperty({ default: '2023-09-01T10:48:50Z' })
  dateReq: Date;
  @ApiProperty({ default: 1 })
  value: number;
  @ApiProperty({ default: 'Good' })
  quality: string;
}
