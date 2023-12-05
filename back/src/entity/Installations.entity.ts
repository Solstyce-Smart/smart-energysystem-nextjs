import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { TagsLive } from './TagsLive.entity';
import { User } from './Users.entity';

@Entity('installation')
export class Installation {
  @PrimaryGeneratedColumn()
  installationId: number;

  @Column()
  ewonId: string;

  @Column()
  name: string;

  @Column()
  abo: number;

  @Column('json', {
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

  @Column({ nullable: true, default: null })
  lastSynchroDate: string;

  @Column('json', { nullable: true })
  address?: {
    address: string;
    postalCode: number;
    latitude: string;
    longitude: string;
  }[];

  @OneToMany(() => TagsLive, (tagsLive) => tagsLive.installation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tagsLive?: TagsLive[];

  @ManyToMany(() => User, (user) => user.installations)
  @JoinTable({
    name: 'user_installation',
    joinColumn: {
      name: 'installationId',
      referencedColumnName: 'installationId',
    },
    inverseJoinColumn: {
      name: 'userId',
      referencedColumnName: 'userId',
    },
  })
  user: User[];
}
