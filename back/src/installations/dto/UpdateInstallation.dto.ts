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
  @ApiProperty({ default: 0 })
  abo: number;
  @ApiProperty({
    default: [
      {
        tarifAchat: [
          { value: 0.2, dates: { dateDebut: new Date(), dateFin: null } },
        ],
      },
      {
        tarifRevente: [
          { value: 0.135, dates: { dateDebut: new Date(), dateFin: null } },
        ],
      },
    ],
    enum: () => [Object],
    nullable: true,
  })
  tarifs?: {
    tarifAchat: {
      value: number;
      dates: {
        dateDebut: Date;
        dateFin: Date | null;
      };
    }[];
    tarifRevente: {
      value: number;
      dates: {
        dateDebut: Date;
        dateFin: Date | null;
      };
    }[];
  }[];
  @ApiProperty({ default: '2021-01-01' })
  lastSynchroDate: string;
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
  @ApiProperty({ type: () => [TagsLive] })
  tagsLive: TagsLive[];
  @ApiProperty({ type: () => [User], readOnly: true })
  user: User[];
}
