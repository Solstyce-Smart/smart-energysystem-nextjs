import { TagsLive } from '../../entity/TagsLive.entity';
import { User } from '../../entity/Users.entity';

export type CreateInstallationParams = {
  id: number;
  ewonId: string;
  name: string;
  nbIRVE: number;
  battery: boolean;
  abo: number;
  lastSynchroDate: Date;
  address?: {
    address: string;
    postalCode: number;
    latitude: string;
    longitude: string;
  }[];
  tagsLive: TagsLive[];
  user: User;
};

export type UpdateInstallationParams = {
  id: number;
  ewonId: string;
  name: string;
  nbIRVE: number;
  battery: boolean;
  abo: number;
  lastSynchroDate: Date;
  address?: {
    address: string;
    postalCode: number;
    latitude: string;
    longitude: string;
  }[];
  tagsLive: TagsLive[];
  user: User;
};
