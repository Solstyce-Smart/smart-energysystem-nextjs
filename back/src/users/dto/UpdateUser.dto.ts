import { ApiProperty } from '@nestjs/swagger';
import { Installation } from '../../entity/Installations.entity';
export class UpdateUserDto {
  @ApiProperty({ default: 'a@a.fr' })
  email: string;
  @ApiProperty({ default: 'password' })
  password: string;
  @ApiProperty({ default: 0 })
  role: number;
  @ApiProperty({ type: () => [Installation] })
  ewonIds: [];
}
