import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { TagsLive } from './TagsLive';
import { User } from './Users';

@Entity('installation')
export class Installation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ewonId: string;

  @Column()
  name: string;

  @Column()
  nbIRVE: number;

  @Column()
  battery: boolean;

  @Column()
  abo: number;

  @Column()
  lastSynchroDate: string;

  @Column('json', { nullable: true })
  address?: {
    address: string;
    postalCode: number;
    latitude: string;
    longitude: string;
  }[];

  @OneToOne(() => TagsLive)
  tagsLive: TagsLive;

  @ManyToOne(() => User, (user) => user.ewonIds, {
    onDelete: 'CASCADE',
  })
  user: User;
}
