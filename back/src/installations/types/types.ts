import { TagsLive } from '../../entity/TagsLive.entity';
import { User } from '../../entity/Users.entity';

export type CreateInstallationParams = {
  id: number;
  ewonId: string;
  name: string;
  abo: number;
  lastSynchroDate: string;
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
  address?: {
    address: string;
    postalCode: number;
    latitude: string;
    longitude: string;
  }[];
  tagsLive: TagsLive[];
  user: User[];
};

export type UpdateInstallationParams = {
  id: number;
  ewonId: string;
  name: string;
  abo: number;
  lastSynchroDate: string;
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
  address?: {
    address: string;
    postalCode: number;
    latitude: string;
    longitude: string;
  }[];
  tagsLive: TagsLive[];
  user: User[];
};
