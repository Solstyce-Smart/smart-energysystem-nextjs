import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Installation } from './Installations.entity';

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

  @ManyToMany(() => Installation, (installation) => installation.user)
  @JoinTable({
    name: 'user_installation',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'userId',
    },
    inverseJoinColumn: {
      name: 'installationId',
      referencedColumnName: 'installationId',
    },
  })
  installations: Installation[];
}
