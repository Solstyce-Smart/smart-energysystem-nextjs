import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Installation } from './Installations';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  userId: number;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  role: number;

  @OneToMany(() => Installation, (installation) => installation.user)
  ewonIds: Installation[];
}
