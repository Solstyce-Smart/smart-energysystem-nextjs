import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Installation } from './Installations.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column()
  clerkId: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  role: number;

  @OneToMany(() => Installation, (installation) => installation.user)
  @ApiProperty({ enum: () => [Installation] })
  ewonIds: Installation[];
}
