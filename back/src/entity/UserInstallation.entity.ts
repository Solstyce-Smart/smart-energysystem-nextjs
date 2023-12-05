import { Entity, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './Users.entity';
import { Installation } from './Installations.entity';

@Entity('user_installation')
export class UserInstallation {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'installation_id' })
  installationId: number;

  @ManyToOne(() => User, (user) => user.installations, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'userId' }])
  user: User;

  @ManyToOne(() => Installation, (installation) => installation.user, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([
    { name: 'installation_id', referencedColumnName: 'installationId' },
  ])
  installation: Installation;
}
