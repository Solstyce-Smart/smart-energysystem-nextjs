import { ApiProperty } from '@nestjs/swagger';
import { TagsLive } from '../../entity/TagsLive.entity';
import { User } from '../../entity/Users.entity';
export class UpdateInstallationDto {
  @ApiProperty({ default: 0, readOnly: true })
  id: number;
  @ApiProperty({ default: 'ewonId' })
  ewonId: string;
  @ApiProperty({ default: 'Centrale' })
  name: string;
  @ApiProperty({ default: 4 })
  nbIRVE: number;
  @ApiProperty({ default: true })
  battery: boolean;
  @ApiProperty({ default: 0 })
  abo: number;
  @ApiProperty({ default: '2023-09-20T07:58:59Z' })
  lastSynchroDate: Date;
  @ApiProperty({
    type: () => [Object],
    default: [
      {
        address: '30 rue des chemins',
        postalCode: 75000,
        latitude: '48.8566969',
        longitude: '2.3514616',
      },
    ],
  })
  address?: {
    address: string;
    postalCode: number;
    latitude: string;
    longitude: string;
  }[];
  @ApiProperty({ type: () => [TagsLive], readOnly: true })
  tagsLive: TagsLive[];
  @ApiProperty({ type: () => [User], readOnly: true })
  user: User;
}
