import { ApiProperty } from '@nestjs/swagger';
import { Installation } from '../../entity/Installations.entity';
export class UpdateUserDto {
  @ApiProperty({ default: 'username' })
  username: string;
  @ApiProperty({ default: 'password' })
  password: string;
  @ApiProperty({ default: 0 })
  role: number;
  @ApiProperty({ type: () => [Installation], readOnly: true })
  ewonIds: [];
}
